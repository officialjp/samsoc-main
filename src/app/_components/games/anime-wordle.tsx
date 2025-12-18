'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '~/trpc/react';
import { Trophy, Timer, XCircle, CheckCircle2, Share2 } from 'lucide-react';

interface AnimeWordleProps {
	searchedAnimeId: string | undefined;
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
}

type FieldKey =
	| 'title'
	| 'releasedYear'
	| 'genres'
	| 'releasedSeason'
	| 'themes'
	| 'studios'
	| 'source'
	| 'score';

interface DisplayField {
	key: FieldKey;
	label: string;
}

interface SavedGuesses {
	animeId: number;
	data: Record<string, unknown>[];
}

const DISPLAY_FIELDS: DisplayField[] = [
	{ key: 'title', label: 'Title' },
	{ key: 'releasedYear', label: 'Year' },
	{ key: 'genres', label: 'Genres' },
	{ key: 'releasedSeason', label: 'Season' },
	{ key: 'themes', label: 'Themes' },
	{ key: 'studios', label: 'Studios' },
	{ key: 'source', label: 'Source' },
	{ key: 'score', label: 'Score' },
];

function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) return '—';
	if (Array.isArray(value))
		return value.map((v) => formatDisplayValue(v)).join(', ');
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return String(value);
	}
	return '—';
}

function checkFieldMatch(targetValue: unknown, guessValue: unknown): boolean {
	if (
		targetValue === null ||
		targetValue === undefined ||
		guessValue === null ||
		guessValue === undefined
	)
		return false;

	if (Array.isArray(targetValue) && Array.isArray(guessValue)) {
		const tArr = targetValue
			.map((v) => formatDisplayValue(v).toLowerCase().trim())
			.sort();
		const gArr = guessValue
			.map((v) => formatDisplayValue(v).toLowerCase().trim())
			.sort();
		return (
			tArr.length === gArr.length &&
			tArr.every((val, idx) => val === gArr[idx])
		);
	}

	const tStr = formatDisplayValue(targetValue).toLowerCase().trim();
	const gStr = formatDisplayValue(guessValue).toLowerCase().trim();
	return tStr === gStr && tStr !== '—';
}

function FieldCell({
	label,
	value,
	isMatch,
	targetValue,
}: {
	label: string;
	value: unknown;
	isMatch?: boolean;
	targetValue?: unknown;
}) {
	const bgColor =
		isMatch === undefined
			? 'bg-white'
			: isMatch
				? 'bg-green-100'
				: 'bg-red-100';
	const showArrow =
		!isMatch &&
		targetValue !== undefined &&
		(label === 'Year' || label === 'Score');
	let arrowDirection: 'up' | 'down' | null = null;

	if (showArrow) {
		const targetNum = Number(targetValue);
		const guessNum = Number(value);
		if (!isNaN(targetNum) && !isNaN(guessNum))
			arrowDirection = guessNum < targetNum ? 'up' : 'down';
	}

	const renderColorCodedValue = () => {
		const isArrayField =
			label === 'Genres' || label === 'Themes' || label === 'Studios';

		if (isArrayField && value && targetValue !== undefined) {
			const valueStr =
				typeof value === 'string' ? value : formatDisplayValue(value);
			const targetStr =
				typeof targetValue === 'string'
					? targetValue
					: formatDisplayValue(targetValue);

			const valueArray = Array.isArray(value)
				? value
				: valueStr.split(',').map((s) => s.trim());

			const targetArray = Array.isArray(targetValue)
				? targetValue
				: targetStr.split(',').map((s) => s.trim());

			const targetSet = new Set(
				targetArray.map((v) => {
					const itemStr =
						typeof v === 'string' ? v : formatDisplayValue(v);
					return itemStr.toLowerCase().trim();
				}),
			);

			return (
				<div className="text-sm font-semibold wrap-break-word">
					{valueArray.map((item, idx) => {
						const itemStr =
							typeof item === 'string'
								? item
								: formatDisplayValue(item);
						const itemMatch = targetSet.has(
							itemStr.toLowerCase().trim(),
						);

						return (
							<span key={idx}>
								<span
									className={
										itemMatch
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									{itemStr.trim()}
								</span>
								{idx < valueArray.length - 1 && ', '}
							</span>
						);
					})}
				</div>
			);
		}

		if (isMatch !== undefined) {
			const textColor = isMatch ? 'text-green-600' : 'text-red-600';
			return (
				<div
					className={`text-sm font-semibold ${textColor} wrap-break-word`}
				>
					{formatDisplayValue(value)}
				</div>
			);
		}

		return (
			<div className="text-sm font-semibold text-gray-900 wrap-break-word">
				{formatDisplayValue(value)}
			</div>
		);
	};

	return (
		<div
			className={`${bgColor} border-2 border-black rounded-lg p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[100px] flex flex-col justify-center relative`}
		>
			<div className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
				{label}
			</div>
			{renderColorCodedValue()}
			{arrowDirection && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-6xl font-bold">
					{arrowDirection === 'up' ? '↑' : '↓'}
				</div>
			)}
		</div>
	);
}

function Countdown() {
	const [timeLeft, setTimeLeft] = useState('');
	useEffect(() => {
		const calculate = () => {
			const now = new Date();
			const tomorrow = new Date();
			tomorrow.setUTCHours(24, 0, 0, 0);
			const diff = tomorrow.getTime() - now.getTime();
			const h = Math.floor(diff / 3600000);
			const m = Math.floor((diff % 3600000) / 60000);
			setTimeLeft(`${h}h ${m}m`);
		};
		calculate();
		const timer = setInterval(calculate, 1000 * 60);
		return () => clearInterval(timer);
	}, []);
	return (
		<div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white/50 px-3 py-1.5 rounded-full border border-black/10">
			<Timer className="w-4 h-4 text-blue-600" />
			<span>Next anime in: {timeLeft}</span>
		</div>
	);
}

export default function AnimeWordle({
	searchedAnimeId,
	gameWon,
	setGameWon,
	setGameFailed,
}: AnimeWordleProps) {
	const [guesses, setGuesses] = useState<Record<string, unknown>[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const utils = api.useUtils();

	const { data: gameData } = api.anime.getAnswerAnime.useQuery();
	const answerAnime = gameData?.anime;
	const hasAlreadyWonToday = gameData?.hasWonToday;
	const hasFailedToday = gameData?.hasFailedToday;

	const isGameOver =
		gameWon ||
		!!hasAlreadyWonToday ||
		!!hasFailedToday ||
		guesses.length >= 12;

	const { data: leaderboard } = api.anime.getLeaderboard.useQuery(undefined, {
		enabled: !!isGameOver,
	});

	const recordGuessMutation = api.anime.recordGuess.useMutation();
	const winMutation = api.anime.submitWin.useMutation({
		onSuccess: () => void utils.anime.getLeaderboard.invalidate(),
	});

	const { data: searchedAnime } = api.anime.getById.useQuery(
		{ id: parseInt(searchedAnimeId ?? '0') },
		{ enabled: !!searchedAnimeId && !isGameOver },
	);

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

	useEffect(() => {
		if (!answerAnime) return;

		const saved = localStorage.getItem('anime_wordle_guesses');
		if (saved) {
			try {
				const parsed = JSON.parse(saved) as SavedGuesses;
				if (parsed.animeId === answerAnime.id) {
					setGuesses(parsed.data);

					const hasWinningGuess = parsed.data.some(
						(guess) =>
							formatDisplayValue(guess.title)
								.toLowerCase()
								.trim() ===
							formatDisplayValue(answerAnime.title)
								.toLowerCase()
								.trim(),
					);

					if (hasWinningGuess) {
						setGameWon(true);
					} else if (parsed.data.length >= 12) {
						setGameFailed(true);
					}
				} else {
					localStorage.removeItem('anime_wordle_guesses');
					setGuesses([]);
					setGameFailed(false);
					setGameWon(false);
				}
			} catch (e) {
				console.error('Failed to parse local storage', e);
			}
		}
	}, [answerAnime, setGameFailed, setGameWon]);

	const processGuess = useCallback(() => {
		if (isGameOver || !searchedAnime || !answerAnime) return;

		const guessData = DISPLAY_FIELDS.reduce(
			(acc, { key }) => ({
				...acc,
				[key]: searchedAnime[key as keyof typeof searchedAnime],
			}),
			{} as Record<string, unknown>,
		);

		if (guesses.some((g) => g.title === guessData.title)) return;

		const newGuesses = [...guesses, guessData];
		setGuesses(newGuesses);
		recordGuessMutation.mutate();

		localStorage.setItem(
			'anime_wordle_guesses',
			JSON.stringify({
				animeId: answerAnime.id,
				data: newGuesses,
			}),
		);

		const isCorrect =
			formatDisplayValue(searchedAnime.title).toLowerCase().trim() ===
			formatDisplayValue(answerAnime.title).toLowerCase().trim();

		if (isCorrect) {
			setGameWon(true);
			winMutation.mutate({ tries: newGuesses.length });
		} else if (newGuesses.length >= 12) {
			setGameFailed(true);
		}
	}, [
		searchedAnime,
		answerAnime,
		isGameOver,
		guesses,
		recordGuessMutation,
		setGameWon,
		setGameFailed,
		winMutation,
	]);

	const handleShare = async () => {
		const emojiGrid = guesses
			.map((guess) => {
				return DISPLAY_FIELDS.map((field) => {
					const isMatch = checkFieldMatch(
						answerAnime?.[field.key as keyof typeof answerAnime],
						guess[field.key],
					);
					return isMatch ? '🟩' : '🟥';
				}).join('');
			})
			.join('\n');

		const shareLink = 'https://samsoc.co.uk/games/wordle';
		const shareText = `Anime Wordle ${new Date().toLocaleDateString('en-GB')}\n${guesses.length}/12\n\n${emojiGrid}\n\nPlay here: ${shareLink}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Anime Wordle Result',
					text: shareText,
				});
			} catch (err) {
				console.error('Error sharing:', err);
			}
		} else {
			try {
				await navigator.clipboard.writeText(shareText);
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), 2000);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		}
	};

	useEffect(() => {
		if (searchedAnime) void processGuess();
	}, [searchedAnime, processGuess]);

	if (!answerAnime) return null;

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
							Anime Wordle
						</h1>
						<div className="flex items-center gap-4">
							{isGameOver ? (
								<div className="flex items-center gap-3">
									<Countdown />
								</div>
							) : (
								<span className="text-sm font-bold text-gray-600 uppercase tracking-tighter">
									Guesses Used: {guesses.length} / 12
								</span>
							)}
						</div>
					</div>

					{isGameOver ? (
						<div className="space-y-8">
							<div
								className={`border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 ${gameWon || hasAlreadyWonToday ? 'bg-green-50' : 'bg-red-50'}`}
							>
								<div className="flex items-start gap-4">
									{gameWon || hasAlreadyWonToday ? (
										<CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
									) : (
										<XCircle className="w-8 h-8 text-red-600 shrink-0" />
									)}
									<div>
										<h2 className="text-2xl font-bold text-gray-900">
											{gameWon || hasAlreadyWonToday
												? 'Journey Complete!'
												: 'Out of Guesses'}
										</h2>
										<p className="text-gray-700">
											{gameWon || hasAlreadyWonToday
												? `You identified the anime in ${guesses.length} tries.`
												: `The answer was ${formatDisplayValue(answerAnime.title)}.`}
										</p>
									</div>
								</div>

								<button
									onClick={() => void handleShare()}
									className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all ${isCopied ? 'bg-green-400' : 'bg-white'}`}
								>
									{isCopied ? (
										'COPIED!'
									) : (
										<>
											<Share2 className="w-5 h-5" /> SHARE
											RESULTS
										</>
									)}
								</button>
							</div>

							<div className="space-y-6">
								<h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm border-b-2 border-black pb-2">
									Your Journey
								</h3>
								<div className="space-y-4">
									{guesses.map((guess, gIdx) => (
										<div
											key={gIdx}
											className="border-2 border-black rounded-2xl bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
										>
											<div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
												{DISPLAY_FIELDS.map(
													({ key }) => (
														<div
															key={key}
															className={`h-2 rounded-full border border-black/10 ${checkFieldMatch(answerAnime[key as keyof typeof answerAnime], guess[key]) ? 'bg-green-500' : 'bg-red-400'}`}
														/>
													),
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
						<div className="space-y-4">
							{[...guesses].reverse().map((guess, idx) => (
								<div
									key={guesses.length - idx}
									className="border-2 border-black rounded-2xl bg-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
													isMatch={checkFieldMatch(
														answerAnime[
															key as keyof typeof answerAnime
														],
														guess[key],
													)}
													targetValue={
														answerAnime[
															key as keyof typeof answerAnime
														]
													}
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
						<div className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8">
							<div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-4">
								<Trophy className="w-5 h-5 text-yellow-500" />
								<h2 className="text-xl font-bold uppercase tracking-tighter">
									Leaderboard
								</h2>
							</div>
							<div className="space-y-3">
								{leaderboard?.map((user, idx) => (
									<div
										key={user.id}
										className="flex justify-between items-center p-3 border-2 border-black rounded-lg bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
									>
										<div className="flex flex-col min-w-0">
											<span className="font-bold text-sm truncate">
												{idx + 1}. {user.name ?? 'Anon'}
											</span>
											<span className="text-[10px] text-gray-500 uppercase font-semibold">
												{user.wordleTotalTries} tries
											</span>
										</div>
										<div className="bg-black text-white px-2 py-1 rounded text-xs font-bold shrink-0">
											{user.wordleWins} W
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
