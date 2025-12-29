'use client';

import { useState, useEffect, useRef } from 'react';
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
import { GAME_CONFIG, REVEAL_SIZES } from '~/lib/game-config';
import type { LeaderboardUser, BannerGuess } from '~/lib/game-types';
import { Maximize2, Eye } from 'lucide-react';
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
				(g: BannerGuess) => g.animeId === answerAnime?.id,
			);
			if (hasWinningGuess) setGameWon(true);
			else if (
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
		if (!isAuthenticated && answerAnime && isLoading) setIsLoading(false);
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
		)
			return;
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
			captureEvent('banner_game:started', {
				is_authenticated: isAuthenticated,
			});
		}

		localGuessIdCounter.current += 1;
		const optimisticGuess: LocalGuess = {
			id: `local-${localGuessIdCounter.current}`,
			animeId,
			animeTitle,
		};
		setGuesses((prev) => {
			const next = [...prev, optimisticGuess];
			guessesRef.current = next;
			return next;
		});

		const newCount = guessesRef.current.length;
		const isCorrect = animeId === answerAnime.id;

		if (isCorrect) {
			setGameWon(true);
			captureEvent('banner_game:won', {
				tries: newCount,
				max_guesses: GAME_CONFIG.BANNER.MAX_GUESSES,
				is_authenticated: isAuthenticated,
			});
		} else if (
			newCount >= GAME_CONFIG.BANNER.MAX_GUESSES &&
			!hasSubmittedLoss.current
		) {
			setGameFailed(true);
			hasSubmittedLoss.current = true;
			captureEvent('banner_game:lost', {
				tries: newCount,
				max_guesses: GAME_CONFIG.BANNER.MAX_GUESSES,
				is_authenticated: isAuthenticated,
			});
		}

		setSearchedAnime(undefined);
		isProcessingRef.current = false;

		if (isAuthenticated) {
			addGuessMutation.mutate({ animeId });
			if (isCorrect) winMutation.mutate({ tries: newCount });
			else if (
				newCount >= GAME_CONFIG.BANNER.MAX_GUESSES &&
				hasSubmittedLoss.current
			)
				lossMutation.mutate();
		}
	};

	useEffect(() => {
		if (searchedAnime && !isProcessingRef.current) {
			const id = parseInt(searchedAnime.id, 10);
			if (!isNaN(id)) processGuess(id, searchedAnime.title);
		}
	}, [searchedAnime]);

	const handleShare = async () => {
		if (!answerAnime) return;
		captureEvent('banner_game:shared', {
			won: gameWon,
			tries: guesses.length,
		});
		const grid = guesses
			.map((g) => (g.animeId === answerAnime.id ? '🟩' : '🟥'))
			.join('');
		const text = `Banner ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/${GAME_CONFIG.BANNER.MAX_GUESSES}\n\n${grid}\n\nPlay: https://samsoc.co.uk/games/banner`;
		if (navigator.share) {
			try {
				await navigator.share({ title: 'Banner Result', text });
			} catch (err) {
				if (err instanceof Error && err.name !== 'AbortError')
					console.error(err);
			}
		} else {
			try {
				await navigator.clipboard.writeText(text);
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
	if (gameError || (!answerAnime && !isLoading))
		return <DailyNotFound gameType="banner" />;
	if (!answerAnime || isLoading) return <GameSkeleton gameType="banner" />;

	// Visibility Index mapping
	const revealIndex = isGameOver ? 6 : guesses.length;
	const revealSize = REVEAL_SIZES[revealIndex] ?? 100;
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
							<div className="w-full max-w-xs mx-auto rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-black p-2">
								<div className="relative w-full aspect-3/4 bg-gray-900 rounded-xl overflow-hidden">
									<Image
										src={answerAnime.image!}
										alt="Final Answer"
										fill
										className="object-cover"
										width={400}
										height={300}
										draggable={false}
										priority
									/>
								</div>
							</div>

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
											className={`border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${guess.animeId === answerAnime.id ? 'bg-green-50' : 'bg-white'}`}
											role="listitem"
										>
											<div className="flex items-center justify-between">
												<div>
													<div className="text-[10px] font-bold uppercase text-gray-400 mb-1">
														Guess #{idx + 1}
													</div>
													<div className="text-sm font-bold text-gray-900">
														{guess.animeTitle}
													</div>
												</div>
												{guess.animeId ===
													answerAnime.id && (
													<span className="text-green-600 font-black">
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
							<div className="w-full max-w-xs mx-auto rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-black p-2">
								<div className="relative w-full aspect-3/4 bg-gray-900 rounded-xl overflow-hidden">
									{answerAnime.image ? (
										<div className="absolute inset-0">
											<Image
												src={answerAnime.image}
												alt="Revealing anime banner"
												fill
												className="object-cover transition-all duration-700 ease-in-out"
												style={{
													maskImage:
														'radial-gradient(circle, black 100%, transparent 100%)',
													maskRepeat: 'no-repeat',
													maskPosition: 'center',
													maskSize: `${revealSize}% ${revealSize}%`,
													WebkitMaskImage:
														'radial-gradient(circle, black 100%, transparent 100%)',
													WebkitMaskRepeat:
														'no-repeat',
													WebkitMaskPosition:
														'center',
													WebkitMaskSize: `${revealSize}% ${revealSize}%`,
												}}
												draggable={false}
												width={400}
												height={300}
												priority
											/>
										</div>
									) : (
										<div className="flex flex-col items-center justify-center h-full text-gray-500">
											<Maximize2 className="w-12 h-12 mb-2" />
											<p className="text-xs font-black uppercase">
												No image
											</p>
										</div>
									)}
								</div>
								<div className="p-3 text-center bg-black">
									<div className="flex items-center justify-center gap-2 mb-1">
										<Eye className="w-3 h-3 text-blue-400" />
										<div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
											Visibility
										</div>
									</div>
									<div className="text-lg font-black text-white">
										{revealSize}%
									</div>
								</div>
							</div>

							<div className="border-2 border-black rounded-2xl bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<div className="space-y-3">
									<div className="text-xs font-bold uppercase text-gray-600 tracking-tighter">
										Reveal Progress
									</div>
									<div className="flex gap-1.5">
										{REVEAL_SIZES.map((_, idx) => (
											<div
												key={idx}
												className={`flex-1 h-3 rounded-full border-2 border-black transition-all ${
													idx <= guesses.length
														? 'bg-blue-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
														: 'bg-gray-100'
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

							{guesses.length > 0 && (
								<div className="space-y-4 pt-4">
									<h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b-2 border-black pb-2">
										Recent Guesses
									</h3>
									<div className="space-y-2" role="list">
										{[...guesses]
											.reverse()
											.map((g, idx) => (
												<div
													key={g.id}
													className="border-2 border-black rounded-xl bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
													role="listitem"
												>
													<div className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
														Guess #
														{guesses.length - idx}
													</div>
													<div className="text-sm font-bold text-gray-900">
														{g.animeTitle}
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
