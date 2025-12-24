'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '~/trpc/react';
import { Trophy, Timer, XCircle, CheckCircle2, Share2 } from 'lucide-react';
import { toast } from 'sonner';

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

type MatchResult = 'exact' | 'partial' | 'none' | 'unknown';

interface DisplayField {
	key: FieldKey;
	label: string;
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

const ARRAY_FIELDS: FieldKey[] = ['genres', 'themes', 'studios'];

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

function isEmpty(val: unknown): boolean {
	if (val === null || val === undefined) return true;
	if (typeof val === 'string' && val.trim() === '') return true;
	if (Array.isArray(val) && val.length === 0) return true;
	return false;
}

function parseToArray(val: unknown): string[] {
	if (isEmpty(val)) return [];
	if (Array.isArray(val)) {
		return val
			.map((v) => formatDisplayValue(v).toLowerCase().trim())
			.filter((s) => s && s !== '—');
	}
	const str = formatDisplayValue(val);
	if (str === '—') return [];
	return str
		.split(',')
		.map((s) => s.toLowerCase().trim())
		.filter((s) => s);
}

function checkFieldMatch(
	targetValue: unknown,
	guessValue: unknown,
	fieldKey?: FieldKey,
): MatchResult {
	const isArrayField = fieldKey && ARRAY_FIELDS.includes(fieldKey);

	const targetEmpty = isEmpty(targetValue);
	const guessEmpty = isEmpty(guessValue);

	// Both empty - exact match
	if (targetEmpty && guessEmpty) return 'exact';

	// Target empty but guess has value - unknown (can't compare)
	if (targetEmpty) return 'unknown';

	// Target has value but guess is empty - no match
	if (guessEmpty) return 'none';

	// For array fields, check for partial matches
	if (isArrayField) {
		const targetArr = parseToArray(targetValue);
		const guessArr = parseToArray(guessValue);

		if (targetArr.length === 0 && guessArr.length === 0) return 'exact';
		if (targetArr.length === 0) return 'unknown';
		if (guessArr.length === 0) return 'none';

		const targetSet = new Set(targetArr);
		const guessSet = new Set(guessArr);

		const matchCount = guessArr.filter((item) =>
			targetSet.has(item),
		).length;

		// Exact match: same items (all match and same count)
		if (targetSet.size === guessSet.size && matchCount === targetSet.size) {
			return 'exact';
		}

		// Partial match: some items overlap
		if (matchCount > 0) {
			return 'partial';
		}

		return 'none';
	}

	// For non-array fields, only exact or no match
	const tStr = formatDisplayValue(targetValue).toLowerCase().trim();
	const gStr = formatDisplayValue(guessValue).toLowerCase().trim();

	if (tStr === gStr && tStr !== '—') {
		return 'exact';
	}

	return 'none';
}

function FieldCell({
	label,
	value,
	matchResult,
	targetValue,
	fieldKey,
}: {
	label: string;
	value: unknown;
	matchResult?: MatchResult;
	targetValue?: unknown;
	fieldKey?: FieldKey;
}) {
	const getBgColor = () => {
		if (matchResult === undefined) return 'bg-white';
		switch (matchResult) {
			case 'exact':
				return 'bg-green-100';
			case 'partial':
				return 'bg-yellow-100';
			case 'none':
				return 'bg-red-100';
			case 'unknown':
				return 'bg-gray-100';
			default:
				return 'bg-white';
		}
	};

	const showArrow =
		matchResult === 'none' &&
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
		const isArrayField = fieldKey && ARRAY_FIELDS.includes(fieldKey);

		if (isArrayField && targetValue !== undefined) {
			const targetArr = parseToArray(targetValue);

			// If target is empty, show gray text
			if (targetArr.length === 0) {
				return (
					<div className="text-sm font-semibold text-gray-500 wrap-break-word">
						{formatDisplayValue(value)}
					</div>
				);
			}

			const targetSet = new Set(targetArr);

			// Get the original display values (not lowercased)
			const displayArray = Array.isArray(value)
				? value
				: formatDisplayValue(value)
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s && s !== '—');

			return (
				<div className="text-sm font-semibold wrap-break-word">
					{displayArray.map((item, idx) => {
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
								{idx < displayArray.length - 1 && ', '}
							</span>
						);
					})}
				</div>
			);
		}

		if (matchResult !== undefined) {
			let textColor: string;
			switch (matchResult) {
				case 'exact':
					textColor = 'text-green-600';
					break;
				case 'partial':
					textColor = 'text-yellow-600';
					break;
				case 'none':
					textColor = 'text-red-600';
					break;
				case 'unknown':
					textColor = 'text-gray-500';
					break;
				default:
					textColor = 'text-gray-900';
			}
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
			className={`${getBgColor()} border-2 border-black rounded-lg p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[100px] flex flex-col justify-center relative`}
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

function getMatchResultForProgress(result: MatchResult): string {
	switch (result) {
		case 'exact':
			return 'bg-green-500';
		case 'partial':
			return 'bg-yellow-500';
		case 'unknown':
			return 'bg-gray-400';
		default:
			return 'bg-red-400';
	}
}

export default function AnimeWordle({
	searchedAnimeId,
	gameWon,
	setGameWon,
	setGameFailed,
}: AnimeWordleProps) {
	const [guesses, setGuesses] = useState<Record<string, unknown>[]>([]);
	const [isCopied, setIsCopied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const utils = api.useUtils();

	const { data: gameData } = api.anime.getAnswerAnime.useQuery();
	const answerAnime = gameData?.anime;
	const hasAlreadyWonToday = gameData?.hasWonToday;
	const hasFailedToday = gameData?.hasFailedToday;

	const { data: session } = api.anime.getTodaysSession.useQuery();

	const isGameOver =
		gameWon ||
		!!hasAlreadyWonToday ||
		!!hasFailedToday ||
		guesses.length >= 12;

	const { data: leaderboard } = api.anime.getLeaderboard.useQuery(undefined, {
		enabled: !!isGameOver,
	});

	const recordGuessMutation = api.anime.recordGuess.useMutation({
		onError: (error) => {
			toast.error(`Failed to record guess: ${error.message}`);
		},
	});
	const addGuessMutation = api.anime.addGameGuess.useMutation({
		onError: (error) => {
			toast.error(`Failed to save guess: ${error.message}`);
		},
	});
	const winMutation = api.anime.submitWin.useMutation({
		onSuccess: () => {
			void utils.anime.getLeaderboard.invalidate();
			toast.success('Congratulations! You won!');
		},
		onError: (error) => {
			toast.error(`Failed to submit win: ${error.message}`);
		},
	});

	const { data: searchedAnime } = api.anime.getById.useQuery(
		{ id: parseInt(searchedAnimeId ?? '0') },
		{ enabled: !!searchedAnimeId && !isGameOver },
	);

	// Load guesses from database on mount
	useEffect(() => {
		if (session) {
			const loadedGuesses = session.guesses.map((g) => {
				const parsed =
					typeof g.guessData === 'string'
						? (JSON.parse(g.guessData) as Record<string, unknown>)
						: (g.guessData as Record<string, unknown>);
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
			} else if (loadedGuesses.length >= 12) {
				setGameFailed(true);
			}

			setIsLoading(false);
		}
	}, [session, answerAnime, setGameWon, setGameFailed]);

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
			recordGuessMutation.isPending ||
			addGuessMutation.isPending
		)
			return;

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

		// Save guess to database
		addGuessMutation.mutate({ guessData });

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
		isLoading,
		guesses,
		recordGuessMutation,
		addGuessMutation,
		setGameWon,
		setGameFailed,
		winMutation,
	]);

	const handleShare = async () => {
		const emojiGrid = guesses
			.map((guess) => {
				return DISPLAY_FIELDS.map((field) => {
					const result = checkFieldMatch(
						answerAnime?.[field.key as keyof typeof answerAnime],
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

	if (!answerAnime || isLoading) return null;

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
