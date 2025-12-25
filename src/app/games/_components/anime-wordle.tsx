'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import Countdown from './countdown';
import Leaderboard from './leaderboard';
import GameOverBanner from './game-over-banner';
import DailyNotFound from './daily-not-found';
import FieldCell from './field-cell';
import GameSkeleton from './game-skeleton';
import LoginPrompt from './login-prompt';
import { useGameAuth } from './use-game-auth';
import {
	checkFieldMatch,
	formatDisplayValue,
	getMatchResultForProgress,
} from './game-utils';
import { DISPLAY_FIELDS, GAME_CONFIG } from '~/lib/game-config';
import type { WordleGuessData, LeaderboardUser } from '~/lib/game-types';

interface AnimeWordleProps {
	searchedAnimeId: string | undefined;
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
}

export default function AnimeWordle({
	searchedAnimeId,
	gameWon,
	setGameWon,
	setGameFailed,
}: AnimeWordleProps) {
	const [guesses, setGuesses] = useState<WordleGuessData[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
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
		api.anime.getAnswerAnime.useQuery(undefined, {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		});

	const answerAnime = gameData?.anime;
	const hasAlreadyWonToday = gameData?.hasWonToday;
	const hasFailedToday = gameData?.hasFailedToday;

	const { data: session } = api.anime.getTodaysSession.useQuery(undefined, {
		enabled: !!answerAnime && isAuthenticated,
		staleTime: 1000 * 60, // 1 minute
	});

	const isGameOver =
		gameWon ||
		!!hasAlreadyWonToday ||
		!!hasFailedToday ||
		guesses.length >= GAME_CONFIG.WORDLE.MAX_GUESSES;

	const { data: leaderboard } = api.anime.getLeaderboard.useQuery(undefined, {
		enabled: isGameOver,
		staleTime: 1000 * 60 * 2, // 2 minutes
	});

	const addGuessMutation = api.anime.addGameGuess.useMutation({
		onError: (error) => {
			// handleAuthError returns true if it was an auth error (and handles showing prompt if needed)
			if (!handleAuthError(error)) {
				toast.error(`Failed to save guess: ${error.message}`);
			}
		},
	});

	const winMutation = api.anime.submitWin.useMutation({
		onSuccess: () => {
			void utils.anime.getLeaderboard.invalidate();
			toast.success('Congratulations! You won!');
		},
		onError: (error) => {
			// Silently ignore auth errors for win submission
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit win: ${error.message}`);
			}
		},
	});

	const lossMutation = api.anime.submitLoss.useMutation({
		onError: (error) => {
			// Silently ignore auth errors for loss submission
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit loss: ${error.message}`);
			}
		},
	});

	const { data: searchedAnime } = api.anime.getById.useQuery(
		{ id: parseInt(searchedAnimeId ?? '0') },
		{
			enabled: !!searchedAnimeId && !isGameOver,
			staleTime: 1000 * 60 * 10, // 10 minutes - anime data rarely changes
		},
	);

	// Load guesses from database on mount
	useEffect(() => {
		if (session) {
			const loadedGuesses = session.guesses.map((g) => {
				const parsed =
					typeof g.guessData === 'string'
						? (JSON.parse(g.guessData) as WordleGuessData)
						: (g.guessData as WordleGuessData);
				return parsed;
			});
			setGuesses(loadedGuesses);

			const hasWinningGuess = loadedGuesses.some(
				(guess) =>
					formatDisplayValue(guess.title).toLowerCase().trim() ===
					formatDisplayValue(answerAnime?.title).toLowerCase().trim(),
			);

			if (hasWinningGuess) {
				setGameWon(true);
			} else if (loadedGuesses.length >= GAME_CONFIG.WORDLE.MAX_GUESSES) {
				setGameFailed(true);
			}

			setIsLoading(false);
		}
	}, [session, answerAnime, setGameWon, setGameFailed]);

	// For unauthenticated users, stop loading once we have game data
	useEffect(() => {
		if (!isAuthenticated && answerAnime && isLoading) {
			setIsLoading(false);
		}
	}, [isAuthenticated, answerAnime, isLoading]);

	useEffect(() => {
		if (hasAlreadyWonToday && !gameWon) setGameWon(true);
		if (hasFailedToday) setGameFailed(true);
	}, [
		hasAlreadyWonToday,
		hasFailedToday,
		gameWon,
		setGameWon,
		setGameFailed,
	]);

	const processGuess = useCallback(() => {
		if (
			isGameOver ||
			!searchedAnime ||
			!answerAnime ||
			isLoading ||
			isProcessingRef.current ||
			addGuessMutation.isPending
		)
			return;

		// Check if we've already processed this selection
		const animeIdStr = String(searchedAnime.id);
		if (lastProcessedIdRef.current === animeIdStr) {
			return;
		}

		// For unauthenticated users who haven't declined auth yet, show login prompt
		if (!isAuthenticated && !hasDeclinedAuth) {
			triggerLoginPrompt();
			return;
		}

		// Check for duplicate guess
		const guessTitle = formatDisplayValue(searchedAnime.title)
			.toLowerCase()
			.trim();
		if (
			guesses.some(
				(g) =>
					formatDisplayValue(g.title).toLowerCase().trim() ===
					guessTitle,
			)
		) {
			// Mark as processed to prevent duplicate toasts
			lastProcessedIdRef.current = animeIdStr;
			toast.error('You already guessed this anime!');
			return;
		}

		isProcessingRef.current = true;
		lastProcessedIdRef.current = animeIdStr;

		const guessData = DISPLAY_FIELDS.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: searchedAnime[key],
			}),
			{} as WordleGuessData,
		);

		const newGuesses = [...guesses, guessData];
		setGuesses(newGuesses);

		// Save guess to database (only for authenticated users)
		if (isAuthenticated) {
			addGuessMutation.mutate(
				{ guessData },
				{
					onSuccess: () => {
						isProcessingRef.current = false;
					},
					onError: () => {
						isProcessingRef.current = false;
						lastProcessedIdRef.current = null;
					},
				},
			);
		} else {
			// For unauthenticated users, just mark processing as done
			isProcessingRef.current = false;
		}

		const isCorrect =
			formatDisplayValue(searchedAnime.title).toLowerCase().trim() ===
			formatDisplayValue(answerAnime.title).toLowerCase().trim();

		if (isCorrect) {
			setGameWon(true);
			// Only submit win for authenticated users
			if (isAuthenticated) {
				winMutation.mutate({ tries: newGuesses.length });
			}
		} else if (newGuesses.length >= GAME_CONFIG.WORDLE.MAX_GUESSES) {
			setGameFailed(true);
			// Only submit loss for authenticated users
			if (isAuthenticated) {
				lossMutation.mutate();
			}
		}
	}, [
		isGameOver,
		searchedAnime,
		answerAnime,
		isLoading,
		addGuessMutation,
		guesses,
		setGameWon,
		setGameFailed,
		winMutation,
		lossMutation,
		isAuthenticated,
		hasDeclinedAuth,
		triggerLoginPrompt,
	]);

	const handleShare = async () => {
		if (!answerAnime) return;

		const emojiGrid = guesses
			.map((guess) => {
				return DISPLAY_FIELDS.map((field) => {
					const result = checkFieldMatch(
						answerAnime[field.key as keyof typeof answerAnime],
						guess[field.key],
						field.key,
					);
					switch (result) {
						case 'exact':
							return '🟩';
						case 'partial':
							return '🟨';
						case 'unknown':
							return '⬜';
						default:
							return '🟥';
					}
				}).join('');
			})
			.join('\n');

		const shareLink = 'https://samsoc.co.uk/games/wordle';
		const shareText = `Anime Wordle ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/${GAME_CONFIG.WORDLE.MAX_GUESSES}\n\n${emojiGrid}\n\nPlay here: ${shareLink}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Anime Wordle Result',
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

	useEffect(() => {
		if (searchedAnime && !isProcessingRef.current) {
			processGuess();
		}
	}, [searchedAnime, processGuess]);

	// Reset lastProcessedIdRef when searchedAnimeId changes to allow re-selection
	useEffect(() => {
		if (!searchedAnimeId) {
			lastProcessedIdRef.current = null;
		}
	}, [searchedAnimeId]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isGameOver) {
				// Could add functionality to close modals or reset
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [isGameOver]);

	// Show login prompt when auth is required (only if user hasn't dismissed it)
	if (showLoginPrompt) {
		return (
			<LoginPrompt
				variant="modal"
				title="Login Required"
				message="Log in to save your guesses and compete on the leaderboard. Or continue playing without saving."
				onDismiss={dismissLoginPrompt}
			/>
		);
	}

	// Show error state if daily anime not found
	if (gameError || (!answerAnime && !isLoading)) {
		return <DailyNotFound gameType="anime" />;
	}

	if (!answerAnime || isLoading) return <GameSkeleton gameType="wordle" />;

	// Leaderboard data is already flattened from the router
	const leaderboardData: LeaderboardUser[] = leaderboard ?? [];

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<div className="mb-8 flex items-center gap-4">
						{isGameOver ? (
							<Countdown label="Next anime in:" />
						) : (
							<span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">
								Guesses Used: {guesses.length} /{' '}
								{GAME_CONFIG.WORDLE.MAX_GUESSES}
							</span>
						)}
					</div>

					{isGameOver ? (
						<div className="space-y-8">
							<GameOverBanner
								won={gameWon || !!hasAlreadyWonToday}
								answer={formatDisplayValue(answerAnime.title)}
								tries={guesses.length}
								onShare={handleShare}
								isShareCopied={isCopied}
								gameType="wordle"
							/>

							<div className="space-y-6">
								<h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b-2 border-black pb-2">
									Your Journey
								</h3>
								<div className="space-y-4" role="list">
									{guesses.map((guess, gIdx) => (
										<div
											key={gIdx}
											className="border-2 border-black rounded-2xl bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
											role="listitem"
										>
											<div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
												{DISPLAY_FIELDS.map(
													({ key }) => {
														const result =
															checkFieldMatch(
																answerAnime[
																	key as keyof typeof answerAnime
																],
																guess[key],
																key,
															);
														return (
															<div
																key={key}
																className={`h-2 rounded-full border border-black/10 ${getMatchResultForProgress(result)}`}
																aria-label={`${key}: ${result}`}
															/>
														);
													},
												)}
											</div>
											<div className="text-xs font-bold uppercase text-gray-500">
												{formatDisplayValue(
													guess.title,
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4" role="list">
							{[...guesses].reverse().map((guess, idx) => (
								<div
									key={guesses.length - idx}
									className="border-2 border-black rounded-2xl bg-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
									role="listitem"
								>
									<div className="text-sm font-bold mb-3">
										Guess #{guesses.length - idx}
									</div>
									<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
										{DISPLAY_FIELDS.map(
											({ key, label }) => (
												<FieldCell
													key={key}
													label={label}
													value={guess[key]}
													matchResult={checkFieldMatch(
														answerAnime[
															key as keyof typeof answerAnime
														],
														guess[key],
														key,
													)}
													targetValue={
														answerAnime[
															key as keyof typeof answerAnime
														]
													}
													fieldKey={key}
												/>
											),
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{isGameOver && (
					<div className="w-full lg:w-80">
						<Leaderboard
							users={leaderboardData}
							gameType="wordle"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
