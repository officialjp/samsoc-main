'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import posthog from 'posthog-js';
import Countdown from './countdown';
import Leaderboard from './leaderboard';
import GameOverBanner from './game-over-banner';
import DailyNotFound from './daily-not-found';
import GameSkeleton from './game-skeleton';
import LoginPrompt from './login-prompt';
import { useGameAuth } from './use-game-auth';
import { GAME_CONFIG, BANNER_ZOOM_LEVELS } from '~/lib/game-config';
import type { LeaderboardUser, BannerGuess } from '~/lib/game-types';
import { Maximize2 } from 'lucide-react';
import Image from 'next/image';
import AnimeSearch, { type AnimeSelection } from './anime-search';

interface LocalGuess {
	id: string;
	animeId: number;
	animeTitle: string;
}

type Guess = BannerGuess | LocalGuess;

interface ZoomedInBannerProps {
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
	searchedAnime?: AnimeSelection;
	setSearchedAnime: (selection: AnimeSelection | undefined) => void;
}

export default function ZoomedInBanner({
	gameWon,
	setGameWon,
	setGameFailed,
	searchedAnime,
	setSearchedAnime,
}: ZoomedInBannerProps) {
	const [guesses, setGuesses] = useState<Guess[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const isProcessingRef = useRef(false);
	const hasSubmittedLoss = useRef(false);
	const guessesRef = useRef<Guess[]>([]);
	const hasInitializedFromSession = useRef(false);
	const localGuessIdCounter = useRef(0);
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
		api.anime.getBannerAnswerAnime.useQuery(undefined, {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		});

	const answerAnime = gameData?.anime;
	const hasAlreadyWonToday = gameData?.hasWonToday;
	const hasFailedToday = gameData?.hasFailedToday;

	const { data: session } = api.anime.getBannerTodaysSession.useQuery(
		undefined,
		{
			enabled: !!answerAnime && isAuthenticated,
			staleTime: 1000 * 60,
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
			staleTime: 1000 * 60 * 2,
		},
	);

	const addGuessMutation = api.anime.addBannerGuess.useMutation({
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to save guess: ${error.message}`);
			}
		},
	});

	const winMutation = api.anime.submitBannerWin.useMutation({
		onSuccess: () => {
			void utils.anime.getBannerLeaderboard.invalidate();
			toast.success('Congratulations! You guessed it!');
		},
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit win: ${error.message}`);
			}
		},
	});

	const lossMutation = api.anime.submitBannerLoss.useMutation({
		onError: (error) => {
			if (!handleAuthError(error)) {
				toast.error(`Failed to submit loss: ${error.message}`);
			}
		},
	});

	useEffect(() => {
		if (session && !hasInitializedFromSession.current) {
			hasInitializedFromSession.current = true;
			setGuesses(session.guesses);
			guessesRef.current = session.guesses;

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

	const processGuess = (animeId: number, animeTitle: string) => {
		if (
			isGameOver ||
			!answerAnime ||
			isLoading ||
			isProcessingRef.current ||
			addGuessMutation.isPending
		) {
			return;
		}

		if (!isAuthenticated && !hasDeclinedAuth) {
			triggerLoginPrompt();
			setSearchedAnime(undefined);
			return;
		}

		if (guessesRef.current.some((g) => g.animeId === animeId)) {
			toast.error('You already guessed this anime!');
			setSearchedAnime(undefined);
			return;
		}

		isProcessingRef.current = true;

		if (guessesRef.current.length === 0) {
			posthog.capture('banner_game:started', {
				is_authenticated: isAuthenticated,
			});
		}

		localGuessIdCounter.current += 1;
		const optimisticGuess: LocalGuess = {
			id: `local-${localGuessIdCounter.current}`,
			animeId,
			animeTitle,
		};

		setGuesses((prevGuesses) => {
			const newGuesses = [...prevGuesses, optimisticGuess];
			guessesRef.current = newGuesses;
			return newGuesses;
		});

		const newGuessCount = guessesRef.current.length;
		const isCorrect = animeId === answerAnime.id;

		if (isCorrect) {
			setGameWon(true);
			posthog.capture('banner_game:won', {
				tries: newGuessCount,
				max_guesses: GAME_CONFIG.BANNER.MAX_GUESSES,
				is_authenticated: isAuthenticated,
				answer_title: answerAnime.title,
			});
		} else if (
			newGuessCount >= GAME_CONFIG.BANNER.MAX_GUESSES &&
			!hasSubmittedLoss.current
		) {
			setGameFailed(true);
			hasSubmittedLoss.current = true;
			posthog.capture('banner_game:lost', {
				tries: newGuessCount,
				max_guesses: GAME_CONFIG.BANNER.MAX_GUESSES,
				is_authenticated: isAuthenticated,
				answer_title: answerAnime.title,
			});
		}

		setSearchedAnime(undefined);
		isProcessingRef.current = false;

		if (isAuthenticated) {
			addGuessMutation.mutate({ animeId });
			if (isCorrect) {
				winMutation.mutate({ tries: newGuessCount });
			} else if (
				newGuessCount >= GAME_CONFIG.BANNER.MAX_GUESSES &&
				hasSubmittedLoss.current
			) {
				lossMutation.mutate();
			}
		}
	};

	useEffect(() => {
		if (searchedAnime && !isProcessingRef.current) {
			const animeId = parseInt(searchedAnime.id, 10);
			if (!isNaN(animeId)) {
				processGuess(animeId, searchedAnime.title);
			}
		}
	}, [searchedAnime]);

	const handleShare = async () => {
		if (!answerAnime) return;

		posthog.capture('banner_game:shared', {
			won: gameWon,
			tries: guesses.length,
		});

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
			}
		}
	};

	if (showLoginPrompt) {
		return (
			<LoginPrompt
				variant="modal"
				title="Login Required"
				message="Log in to save your guesses."
				onDismiss={dismissLoginPrompt}
			/>
		);
	}

	if (gameError || (!answerAnime && !isLoading)) {
		return <DailyNotFound gameType="banner" />;
	}

	if (!answerAnime || isLoading) return <GameSkeleton gameType="banner" />;

	const currentZoomLevel = Math.min(
		guesses.length,
		BANNER_ZOOM_LEVELS.length - 1,
	);
	const zoomPercentage = BANNER_ZOOM_LEVELS[currentZoomLevel] ?? 1;
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
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-6">
							<div className="border-2 border-black rounded-2xl bg-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs mx-auto">
								<div
									className="relative w-full aspect-3/4 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
									style={{ maxHeight: '400px' }}
								>
									{answerAnime.image ? (
										<div className="absolute inset-0 flex items-center justify-center overflow-hidden">
											<Image
												src={answerAnime.image}
												alt="Zoomed banner"
												fill
												className="object-cover"
												style={{
													transform: `scale(${1 / zoomPercentage})`,
													transformOrigin: 'center',
												}}
												sizes="320px"
												priority
											/>
										</div>
									) : (
										<div className="text-gray-400">
											<Maximize2 className="mx-auto" />
										</div>
									)}
								</div>
							</div>
							<div className="border-2 border-black rounded-xl bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
								<div className="space-y-2">
									<div className="text-xs font-bold uppercase text-gray-600">
										Image Clarity Progress
									</div>
									<div className="flex gap-2">
										{BANNER_ZOOM_LEVELS.map((_, idx) => (
											<div
												key={idx}
												className={`flex-1 h-2 rounded-full border border-black/20 ${
													idx <= currentZoomLevel
														? 'bg-blue-500'
														: 'bg-gray-200'
												}`}
											/>
										))}
									</div>
								</div>
							</div>
							<AnimeSearch
								onSelect={setSearchedAnime}
								disabled={isGameOver}
							/>
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
