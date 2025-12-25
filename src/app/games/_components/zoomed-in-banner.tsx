'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import Countdown from './countdown';
import Leaderboard from './leaderboard';
import GameOverBanner from './game-over-banner';
import DailyNotFound from './daily-not-found';
import GameSkeleton from './game-skeleton';
import { GAME_CONFIG, BANNER_ZOOM_LEVELS } from '~/lib/game-config';
import type { LeaderboardUser, BannerGuess } from '~/lib/game-types';
import { Maximize2 } from 'lucide-react';
import Image from 'next/image';
import AnimeSearch from './anime-search';

interface ZoomedInBannerProps {
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
	searchedAnimeId?: string;
	setSearchedAnimeId: (id: string | undefined) => void;
}

export default function ZoomedInBanner({
	gameWon,
	setGameWon,
	setGameFailed,
	searchedAnimeId,
	setSearchedAnimeId,
}: ZoomedInBannerProps) {
	const [guesses, setGuesses] = useState<BannerGuess[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const isProcessingRef = useRef(false);
	const hasSubmittedLoss = useRef(false);
	const processedAnimeRef = useRef<number | null>(null);
	const utils = api.useUtils();

	const { data: gameData, error: gameError } =
		api.anime.getBannerAnswerAnime.useQuery(undefined, {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		});

	const answerAnime = gameData?.anime;
	const hasAlreadyWonToday = gameData?.hasWonToday;
	const hasFailedToday = gameData?.hasFailedToday;

	const { data: session } = api.anime.getBannerTodaysSession.useQuery(
		undefined,
		{
			enabled: !!answerAnime,
			staleTime: 1000 * 60, // 1 minute
		},
	);

	const isGameOver =
		gameWon ||
		!!hasAlreadyWonToday ||
		!!hasFailedToday ||
		guesses.length >= GAME_CONFIG.BANNER.MAX_GUESSES;

	const { data: leaderboard } = api.anime.getBannerLeaderboard.useQuery(
		undefined,
		{
			enabled: isGameOver,
			staleTime: 1000 * 60 * 2, // 2 minutes
		},
	);

	const addGuessMutation = api.anime.addBannerGuess.useMutation({
		onError: (error) => {
			toast.error(`Failed to save guess: ${error.message}`);
		},
	});

	const winMutation = api.anime.submitBannerWin.useMutation({
		onSuccess: () => {
			void utils.anime.getBannerLeaderboard.invalidate();
			toast.success('Congratulations! You guessed it!');
		},
		onError: (error) => {
			toast.error(`Failed to submit win: ${error.message}`);
		},
	});

	const lossMutation = api.anime.submitBannerLoss.useMutation({
		onError: (error) => {
			toast.error(`Failed to submit loss: ${error.message}`);
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
			setGuesses(session.guesses);

			const hasWinningGuess = session.guesses.some(
				(guess: BannerGuess) => guess.animeId === answerAnime?.id,
			);

			if (hasWinningGuess) {
				setGameWon(true);
			} else if (
				session.guesses.length >= GAME_CONFIG.BANNER.MAX_GUESSES &&
				!session.failed &&
				!hasSubmittedLoss.current
			) {
				setGameFailed(true);
				hasSubmittedLoss.current = true;
				lossMutation.mutate();
			}

			setIsLoading(false);
		}
	}, [session, answerAnime, setGameWon, setGameFailed, lossMutation]);

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

		// Check if we've already processed this anime ID
		if (processedAnimeRef.current === searchedAnime.id) {
			return;
		}

		// Mark as processed immediately to prevent duplicate toasts
		processedAnimeRef.current = searchedAnime.id;

		// Check for duplicate guess
		if (guesses.some((g) => g.animeId === searchedAnime.id)) {
			toast.error('You already guessed this anime!');
			setSearchedAnimeId(undefined);
			return;
		}

		isProcessingRef.current = true;

		// Save guess to database
		addGuessMutation.mutate(
			{ animeId: searchedAnime.id },
			{
				onSuccess: (newGuess) => {
					const newGuesses = [...guesses, newGuess];
					setGuesses(newGuesses);

					const isCorrect = searchedAnime.id === answerAnime.id;

					if (isCorrect) {
						setGameWon(true);
						winMutation.mutate({ tries: newGuesses.length });
					} else if (
						newGuesses.length >= GAME_CONFIG.BANNER.MAX_GUESSES &&
						!hasSubmittedLoss.current
					) {
						setGameFailed(true);
						hasSubmittedLoss.current = true;
						lossMutation.mutate();
					}

					// Reset search input after successful guess processing
					setSearchedAnimeId(undefined);
					isProcessingRef.current = false;
				},
				onError: () => {
					setSearchedAnimeId(undefined);
					isProcessingRef.current = false;
					processedAnimeRef.current = null;
				},
			},
		);
	}, [
		isGameOver,
		searchedAnime,
		answerAnime,
		isLoading,
		addGuessMutation,
		guesses,
		setGameWon,
		setGameFailed,
		setSearchedAnimeId,
		winMutation,
		lossMutation,
	]);

	const handleShare = async () => {
		if (!answerAnime) return;

		const shareLink = 'https://samsoc.co.uk/games/banner';
		const emojiGrid = guesses
			.map((guess) => (guess.animeId === answerAnime.id ? '🟩' : '🟥'))
			.join('');

		const shareText = `Zoomed-In Banner ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/${GAME_CONFIG.BANNER.MAX_GUESSES}\n\n${emojiGrid}\n\nPlay here: ${shareLink}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Zoomed-In Banner Result',
					text: shareText,
				});
			} catch (err) {
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

	// Reset processedAnimeRef when searchedAnimeId is cleared to allow re-selection
	useEffect(() => {
		if (!searchedAnimeId) {
			processedAnimeRef.current = null;
		}
	}, [searchedAnimeId]);

	// Show error state if daily anime not found
	if (gameError || (!answerAnime && !isLoading)) {
		return <DailyNotFound gameType="banner" />;
	}

	if (!answerAnime || isLoading) return <GameSkeleton gameType="banner" />;

	const currentZoomLevel = Math.min(
		guesses.length,
		BANNER_ZOOM_LEVELS.length - 1,
	);
	const zoomPercentage = BANNER_ZOOM_LEVELS[currentZoomLevel] ?? 1;

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
								{GAME_CONFIG.BANNER.MAX_GUESSES}
							</span>
						)}
					</div>

					{isGameOver ? (
						<div className="space-y-8">
							<GameOverBanner
								won={gameWon || !!hasAlreadyWonToday}
								answer={answerAnime.title}
								tries={guesses.length}
								onShare={handleShare}
								isShareCopied={isCopied}
								gameType="banner"
							/>

							<div className="space-y-6">
								<h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b-2 border-black pb-2">
									Your Guesses
								</h3>
								<div className="space-y-3" role="list">
									{guesses.map((guess, idx) => (
										<div
											key={guess.id}
											className={`border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
												guess.animeId === answerAnime.id
													? 'bg-green-50'
													: 'bg-gray-50'
											}`}
											role="listitem"
										>
											<div className="flex items-center justify-between">
												<div>
													<div className="text-xs font-bold uppercase text-gray-500 mb-1">
														Guess #{idx + 1}
													</div>
													<div className="text-sm font-semibold text-gray-900">
														{guess.animeTitle}
													</div>
												</div>
												{guess.animeId ===
													answerAnime.id && (
													<span className="text-green-600 text-lg">
														✓
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-6">
							{/* Zoomed Image Display */}
							<div className="border-2 border-black rounded-2xl bg-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs mx-auto">
								<div
									className="relative w-full aspect-3/4 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
									style={{ maxHeight: '400px' }}
								>
									{answerAnime.image ? (
										<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
											<Image
												src={answerAnime.image}
												alt="Zoomed anime banner"
												fill
												className="object-cover"
												style={{
													transform: `scale(${1 / zoomPercentage})`,
													transformOrigin:
														'center center',
												}}
												sizes="320px"
												priority
											/>
										</div>
									) : (
										<div className="text-gray-400 text-center">
											<Maximize2 className="w-12 h-12 mx-auto mb-2" />
											<p>No image available</p>
										</div>
									)}
								</div>
								<div className="mt-3 text-xs font-bold text-gray-300 uppercase tracking-tighter text-center">
									Zoom Level:{' '}
									{Math.round(zoomPercentage * 100)}%
								</div>
							</div>

							{/* Zoom Indicator */}
							<div className="border-2 border-black rounded-xl bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
								<div className="space-y-2">
									<div className="text-xs font-bold uppercase text-gray-600 tracking-tighter">
										Image Clarity Progress
									</div>
									<div className="flex gap-2">
										{BANNER_ZOOM_LEVELS.map((_, idx) => (
											<div
												key={idx}
												className={`flex-1 h-2 rounded-full border border-black/20 transition-colors ${
													idx <= currentZoomLevel
														? 'bg-blue-500'
														: 'bg-gray-200'
												}`}
											/>
										))}
									</div>
								</div>
							</div>

							{/* Search Component */}
							<AnimeSearch
								onSelect={setSearchedAnimeId}
								disabled={isGameOver}
							/>
							{/* Recent Guesses */}
							{guesses.length > 0 && (
								<div className="space-y-4">
									<h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b-2 border-black pb-2">
										Recent Guesses
									</h3>
									<div className="space-y-2" role="list">
										{[...guesses]
											.reverse()
											.map((guess, idx) => (
												<div
													key={guess.id}
													className="border-2 border-black rounded-lg bg-gray-50 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
													role="listitem"
												>
													<div className="text-xs font-bold uppercase text-gray-500 mb-1">
														Guess #
														{guesses.length - idx}
													</div>
													<div className="text-sm font-semibold text-gray-900">
														{guess.animeTitle}
													</div>
												</div>
											))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{isGameOver && (
					<div className="w-full lg:w-80">
						<Leaderboard
							users={leaderboardData}
							gameType="banner"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
