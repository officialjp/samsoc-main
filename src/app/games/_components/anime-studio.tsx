'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { captureEvent } from '~/lib/posthog-client';
import Countdown from './countdown';
import Leaderboard from './leaderboard';
import GameOverBanner from './game-over-banner';
import DailyNotFound from './daily-not-found';
import GameSkeleton from './game-skeleton';
import LoginPrompt from './login-prompt';
import { useGameAuth } from './use-game-auth';
import { HINT_LABELS, GAME_CONFIG } from '~/lib/game-config';
import type { LeaderboardUser } from '~/lib/game-types';

interface StudioGameProps {
	selectedStudio: { id: string; name: string } | null;
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
	onLoadingChange?: (isLoading: boolean) => void;
}

export default function StudioGame({
	selectedStudio,
	gameWon,
	setGameWon,
	setGameFailed,
	onLoadingChange,
}: StudioGameProps) {
	const [guesses, setGuesses] = useState<{ studioName: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCopied, setIsCopied] = useState(false);
	const isProcessingRef = useRef(false);
	const lastProcessedIdRef = useRef<string | null>(null);
	const utils = api.useUtils();

	const {
		isAuthenticated,
		showLoginPrompt,
		dismissLoginPrompt,
		handleAuthError,
		hasDeclinedAuth,
		triggerLoginPrompt,
	} = useGameAuth();

	const { data: gameData, error: gameError } =
		api.studio.getAnswerStudio.useQuery(undefined, {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		});

	const answerStudio = gameData?.studio;

	const isGameOver =
		gameWon ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday ||
		guesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES;

	const { data: leaderboard = [] } = api.studio.getLeaderboard.useQuery(
		undefined,
		{
			enabled: isGameOver,
			staleTime: 1000 * 60 * 2,
		},
	);

	const { data: session } = api.studio.getTodaysSession.useQuery(undefined, {
		enabled: !!gameData?.studio && isAuthenticated,
		staleTime: 1000 * 60,
	});

	const addGuessMutation = api.studio.addGameGuess.useMutation({
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to save guess: ${error.message}`);
				setGuesses((prev) => prev.slice(0, -1));
			}
			isProcessingRef.current = false;
		},
		onSuccess: () => {
			isProcessingRef.current = false;
		},
	});

	const winMutation = api.studio.submitWin.useMutation({
		onSuccess: () => {
			void utils.studio.getLeaderboard.invalidate();
			toast.success('Congratulations! You won!');
		},
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit win: ${error.message}`);
			}
		},
	});

	const lossMutation = api.studio.submitLoss.useMutation({
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit loss: ${error.message}`);
			}
		},
	});

	useEffect(() => {
		if (session) {
			setGuesses(
				session.guesses.map((g) => ({ studioName: g.studioName })),
			);
			const isWin = session.guesses.some(
				(g) =>
					g.studioName.toLowerCase().trim() ===
					answerStudio?.name.toLowerCase().trim(),
			);
			if (isWin) setGameWon(true);
			else if (session.guesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES)
				setGameFailed(true);
			setIsLoading(false);
		}
	}, [session, answerStudio, setGameWon, setGameFailed]);

	useEffect(() => {
		if (!isAuthenticated && answerStudio && isLoading) setIsLoading(false);
	}, [isAuthenticated, answerStudio, isLoading]);

	useEffect(() => {
		onLoadingChange?.(isLoading);
	}, [isLoading, onLoadingChange]);

	const processGuess = useCallback(() => {
		if (
			isGameOver ||
			!selectedStudio ||
			!answerStudio ||
			isLoading ||
			isProcessingRef.current ||
			addGuessMutation.isPending
		)
			return;

		if (lastProcessedIdRef.current === selectedStudio.id) return;
		if (!isAuthenticated && !hasDeclinedAuth) {
			triggerLoginPrompt();
			return;
		}
		if (guesses.some((g) => g.studioName === selectedStudio.name)) {
			lastProcessedIdRef.current = selectedStudio.id;
			toast.error('You already guessed this studio!');
			return;
		}

		isProcessingRef.current = true;
		lastProcessedIdRef.current = selectedStudio.id;

		// Track start on first guess
		if (guesses.length === 0) {
			captureEvent('studio_game:started', {
				is_authenticated: isAuthenticated,
			});
		}

		const newGuesses = [...guesses, { studioName: selectedStudio.name }];
		setGuesses(newGuesses);

		if (isAuthenticated)
			addGuessMutation.mutate({ studioName: selectedStudio.name });
		else isProcessingRef.current = false;

		const isCorrect =
			selectedStudio.name.toLowerCase().trim() ===
			answerStudio.name.toLowerCase().trim();

		if (isCorrect) {
			setGameWon(true);
			captureEvent('studio_game:won', {
				tries: newGuesses.length,
				max_guesses: GAME_CONFIG.STUDIO.MAX_GUESSES,
				is_authenticated: isAuthenticated,
			});
			if (isAuthenticated)
				winMutation.mutate({ tries: newGuesses.length });
		} else if (newGuesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES) {
			setGameFailed(true);
			captureEvent('studio_game:lost', {
				tries: newGuesses.length,
				max_guesses: GAME_CONFIG.STUDIO.MAX_GUESSES,
				is_authenticated: isAuthenticated,
			});
			if (isAuthenticated) lossMutation.mutate();
		}
	}, [
		isGameOver,
		selectedStudio,
		answerStudio,
		isLoading,
		addGuessMutation,
		isAuthenticated,
		hasDeclinedAuth,
		triggerLoginPrompt,
		guesses,
		setGameWon,
		winMutation,
		setGameFailed,
		lossMutation,
	]);

	useEffect(() => {
		if (selectedStudio && !isProcessingRef.current) processGuess();
	}, [selectedStudio, processGuess]);

	useEffect(() => {
		if (!selectedStudio) lastProcessedIdRef.current = null;
	}, [selectedStudio]);

	const getHintValue = (idx: number) => {
		if (!answerStudio) return '';
		switch (idx) {
			case 0:
				return answerStudio.avgRating.toFixed(2);
			case 1:
				return `${answerStudio.firstAnimeYear} - ${answerStudio.lastAnimeYear}`;
			case 2:
				return Array.isArray(answerStudio.topGenres)
					? answerStudio.topGenres.join(', ')
					: '';
			case 3:
				return Array.isArray(answerStudio.characters)
					? answerStudio.characters.join(', ')
					: '';
			case 4:
				return Array.isArray(answerStudio.animeList)
					? answerStudio.animeList.join(', ')
					: '';
			default:
				return '';
		}
	};

	const handleShare = async () => {
		if (!answerStudio) return;
		captureEvent('studio_game:shared', {
			won: gameWon,
			tries: guesses.length,
		});

		const emojiGrid = guesses
			.map((g) =>
				g.studioName.toLowerCase().trim() ===
				answerStudio.name.toLowerCase().trim()
					? '🟩'
					: '🟥',
			)
			.join('');
		const shareLink = 'https://samsoc.co.uk/games/studio';
		const shareText = `Studio Guesser ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/${GAME_CONFIG.STUDIO.MAX_GUESSES}\n\n${emojiGrid}\n\nPlay here: ${shareLink}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Studio Result',
					text: shareText,
				});
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError')
					console.error(err);
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 2000);
			} catch (err) {
				toast.error('Failed to copy');
			}
		}
	};

	if (showLoginPrompt)
		return (
			<LoginPrompt
				variant="modal"
				title="Login Required"
				message="Log in to save your guesses and compete on the leaderboard. Or continue playing without saving."
				onDismiss={dismissLoginPrompt}
			/>
		);
	if (gameError || (!answerStudio && !isLoading))
		return <DailyNotFound gameType="studio" />;
	if (!answerStudio || isLoading) return <GameSkeleton gameType="studio" />;

	const leaderboardData: LeaderboardUser[] = leaderboard;

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<div className="mb-8 flex items-center gap-4">
						{isGameOver ? (
							<Countdown label="Next studio in:" />
						) : (
							<span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">
								Guesses Used: {guesses.length} /{' '}
								{GAME_CONFIG.STUDIO.MAX_GUESSES}
							</span>
						)}
					</div>
					{isGameOver && (
						<div className="mb-8">
							<GameOverBanner
								won={gameWon || !!gameData?.hasWonToday}
								answer={answerStudio.name}
								tries={guesses.length}
								onShare={handleShare}
								isShareCopied={isCopied}
								gameType="studio"
							/>
						</div>
					)}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{HINT_LABELS.map((label, idx) => (
							<div
								key={idx}
								className={`bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${idx <= guesses.length || isGameOver ? 'opacity-100' : 'opacity-40'}`}
								role="region"
								aria-label={`Hint ${idx + 1}: ${label}`}
							>
								<p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
									{label}
								</p>
								<p className="text-lg font-black text-gray-900 leading-tight">
									{idx <= guesses.length || isGameOver
										? getHintValue(idx) || '—'
										: 'LOCKED'}
								</p>
							</div>
						))}
					</div>
				</div>
				{isGameOver && (
					<aside
						className="w-full lg:w-80"
						aria-label="Game leaderboard"
					>
						<Leaderboard
							users={leaderboardData}
							gameType="studio"
						/>
					</aside>
				)}
			</div>
		</div>
	);
}
