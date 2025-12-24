'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import Countdown from './countdown';
import Leaderboard from './leaderboard';
import GameOverBanner from './game-over-banner';
import DailyNotFound from './daily-not-found';
import GameSkeleton from './game-skeleton';
import { HINT_LABELS, GAME_CONFIG } from '~/lib/game-config';
import type { LeaderboardUser } from '~/lib/game-types';

interface StudioGameProps {
	selectedStudioId: string | undefined;
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
}

export default function StudioGame({
	selectedStudioId,
	gameWon,
	setGameWon,
	setGameFailed,
}: StudioGameProps) {
	const [guesses, setGuesses] = useState<{ studioName: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCopied, setIsCopied] = useState(false);
	const isProcessingRef = useRef(false);
	const lastProcessedIdRef = useRef<string | null>(null);
	const utils = api.useUtils();

	const { data: gameData, error: gameError } =
		api.studio.getAnswerStudio.useQuery(undefined, {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		});

	const answerStudio = gameData?.studio;

	const isGameOver =
		gameWon ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday ||
		guesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES;

	// Only fetch leaderboard when game is over
	const { data: leaderboard = [] } = api.studio.getLeaderboard.useQuery(
		undefined,
		{
			enabled: isGameOver,
			staleTime: 1000 * 60 * 2, // 2 minutes
		},
	);

	const { data: allStudios } = api.studio.getAllStudios.useQuery(undefined, {
		staleTime: 1000 * 60 * 30, // 30 minutes - studio list rarely changes
	});

	const { data: session } = api.studio.getTodaysSession.useQuery(undefined, {
		enabled: !!gameData?.studio,
		staleTime: 1000 * 60, // 1 minute
	});

	const addGuessMutation = api.studio.addGameGuess.useMutation({
		onError: (error) => {
			toast.error(`Failed to save guess: ${error.message}`);
			isProcessingRef.current = false;
			// Revert the guess on error
			setGuesses((prev) => prev.slice(0, -1));
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
			toast.error(`Failed to submit win: ${error.message}`);
		},
	});

	const lossMutation = api.studio.submitLoss.useMutation({
		onError: (error) => {
			toast.error(`Failed to submit loss: ${error.message}`);
		},
	});

	// Load guesses from database on mount
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

			const isLoss =
				session.guesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES;

			if (isWin) {
				setGameWon(true);
			} else if (isLoss) {
				setGameFailed(true);
			}

			setIsLoading(false);
		}
	}, [session, answerStudio, setGameWon, setGameFailed]);

	const processGuess = useCallback(() => {
		if (
			isGameOver ||
			!selectedStudioId ||
			!answerStudio ||
			!allStudios ||
			isLoading ||
			isProcessingRef.current ||
			addGuessMutation.isPending
		)
			return;

		// Check if we've already processed this selection
		if (lastProcessedIdRef.current === selectedStudioId) {
			return;
		}

		const selected = allStudios.find((s) => s.id === selectedStudioId);
		if (!selected) return;

		// Check for duplicate guess
		if (guesses.some((g) => g.studioName === selected.name)) {
			// Mark as processed to prevent duplicate toasts
			lastProcessedIdRef.current = selectedStudioId;
			toast.error('You already guessed this studio!');
			return;
		}

		isProcessingRef.current = true;
		lastProcessedIdRef.current = selectedStudioId;

		const newGuesses = [...guesses, { studioName: selected.name }];
		setGuesses(newGuesses);

		// Save guess to database
		addGuessMutation.mutate({ studioName: selected.name });

		if (
			selected.name.toLowerCase().trim() ===
			answerStudio.name.toLowerCase().trim()
		) {
			setGameWon(true);
			winMutation.mutate({ tries: newGuesses.length });
		} else if (newGuesses.length >= GAME_CONFIG.STUDIO.MAX_GUESSES) {
			setGameFailed(true);
			lossMutation.mutate();
		}
	}, [
		isGameOver,
		selectedStudioId,
		answerStudio,
		allStudios,
		isLoading,
		addGuessMutation,
		guesses,
		setGameWon,
		setGameFailed,
		winMutation,
		lossMutation,
	]);

	// Process guess when studio is selected
	useEffect(() => {
		if (selectedStudioId && !isProcessingRef.current) {
			processGuess();
		}
	}, [selectedStudioId, processGuess]);

	// Reset lastProcessedIdRef when selectedStudioId changes to allow re-selection
	useEffect(() => {
		if (!selectedStudioId) {
			lastProcessedIdRef.current = null;
		}
	}, [selectedStudioId]);

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

		const emojiGrid = guesses
			.map((guess) => {
				const isCorrect =
					guess.studioName.toLowerCase().trim() ===
					answerStudio.name.toLowerCase().trim();
				return isCorrect ? '🟩' : '🟥';
			})
			.join('');

		const shareLink = 'https://samsoc.co.uk/games/studio';
		const shareText = `Studio Guesser ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/${GAME_CONFIG.STUDIO.MAX_GUESSES}\n\n${emojiGrid}\n\nPlay here: ${shareLink}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Studio Guesser Result',
					text: shareText,
				});
			} catch (err) {
				// User cancelled or error occurred - ignore
				if (err instanceof Error && err.name !== 'AbortError') {
					console.error('Error sharing:', err);
				}
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 2000);
			} catch (err) {
				toast.error('Failed to copy to clipboard');
				console.error('Failed to copy:', err);
			}
		}
	};

	// Show error state if daily studio not found
	if (gameError || (!answerStudio && !isLoading)) {
		return <DailyNotFound gameType="studio" />;
	}

	if (!answerStudio || isLoading) return <GameSkeleton gameType="studio" />;

	// Leaderboard data is already flattened from the router
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
								shareButtonText="SHARE RESULTS"
								isShareCopied={isCopied}
								gameType="studio"
							/>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{HINT_LABELS.map((label, idx) => (
							<div
								key={idx}
								className={`bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
									idx <= guesses.length || isGameOver
										? 'opacity-100'
										: 'opacity-40'
								}`}
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
