'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '~/trpc/react';
import { Trophy, XCircle, CheckCircle2, Timer } from 'lucide-react';

interface StudioGameProps {
	selectedStudioId: string | undefined;
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
}

// Define the shape of our local storage data
interface SavedStudioGame {
	studioId: string;
	guesses: { studioName: string }[];
}

const HINT_LABELS = [
	'Average Rating',
	'First & Last Anime Year',
	'Prominent Source Material',
	'10 Notable Characters',
	'5 Notable Shows',
];

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
			<span>Next studio in: {timeLeft}</span>
		</div>
	);
}

export default function StudioGame({
	selectedStudioId,
	gameWon,
	setGameWon,
	setGameFailed,
}: StudioGameProps) {
	const [guesses, setGuesses] = useState<{ studioName: string }[]>([]);
	const utils = api.useUtils();

	const { data: gameData } = api.studio.getAnswerStudio.useQuery();
	const { data: leaderboard = [] } = api.studio.getLeaderboard.useQuery();
	const { data: allStudios } = api.studio.getAllStudios.useQuery();

	const answerStudio = gameData?.studio;

	// FIXED LOGIC: Use OR (||) instead of Nullish Coalescing (??)
	// to ensure game failure or win state is caught correctly.
	const isGameOver =
		gameWon ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday ||
		guesses.length >= 5;

	const recordGuessMutation = api.studio.recordGuess.useMutation();
	const winMutation = api.studio.submitWin.useMutation({
		onSuccess: () => void utils.studio.getLeaderboard.invalidate(),
	});

	// FIXED: Safe parsing of localStorage to avoid @typescript-eslint/no-unsafe-assignment
	useEffect(() => {
		if (answerStudio) {
			const saved = localStorage.getItem('studio_game_guesses');
			if (saved) {
				try {
					const parsed = JSON.parse(saved) as SavedStudioGame;
					// Validate structure before setting state
					if (
						parsed &&
						parsed.studioId === answerStudio.id &&
						Array.isArray(parsed.guesses)
					) {
						setGuesses(parsed.guesses);
					}
				} catch (e) {
					console.error('Failed to parse saved guesses:', e);
				}
			}
		}
	}, [answerStudio]);

	const processGuess = useCallback(() => {
		if (isGameOver || !selectedStudioId || !answerStudio || !allStudios)
			return;

		const selected = allStudios.find((s) => s.id === selectedStudioId);
		if (!selected || guesses.some((g) => g.studioName === selected.name))
			return;

		const newGuesses = [...guesses, { studioName: selected.name }];
		setGuesses(newGuesses);
		recordGuessMutation.mutate();

		localStorage.setItem(
			'studio_game_guesses',
			JSON.stringify({ studioId: answerStudio.id, guesses: newGuesses }),
		);

		if (
			selected.name.toLowerCase().trim() ===
			answerStudio.name.toLowerCase().trim()
		) {
			setGameWon(true);
			winMutation.mutate({ tries: newGuesses.length });
		} else if (newGuesses.length >= 5) {
			setGameFailed(true);
		}
	}, [
		selectedStudioId,
		answerStudio,
		allStudios,
		isGameOver,
		guesses,
		recordGuessMutation,
		winMutation,
		setGameWon,
		setGameFailed,
	]);

	useEffect(() => {
		if (selectedStudioId) void processGuess();
	}, [selectedStudioId, processGuess]);

	const getHintValue = (idx: number) => {
		if (!answerStudio) return '';
		switch (idx) {
			case 0:
				return answerStudio.avgRating.toFixed(2);
			case 1:
				return `${answerStudio.firstAnimeYear} - ${answerStudio.lastAnimeYear}`;
			case 2:
				return answerStudio.prominentSource;
			case 3:
				// Ensure these are arrays before joining to avoid runtime errors
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

	if (!answerStudio) return null;

	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					<div className="mb-8">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
							Studio Guesser
						</h1>
						<div className="flex items-center gap-4">
							<Countdown />
						</div>
					</div>

					{isGameOver && (
						<div
							className={`border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
								gameWon || gameData?.hasWonToday
									? 'bg-green-50'
									: 'bg-red-50'
							}`}
						>
							<div className="flex items-start gap-4">
								{gameWon || gameData?.hasWonToday ? (
									<CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
								) : (
									<XCircle className="w-8 h-8 text-red-600 shrink-0" />
								)}
								<div>
									<h2 className="text-2xl font-bold text-gray-900">
										{gameWon || gameData?.hasWonToday
											? 'Contract Signed!'
											: 'Studio Closed'}
									</h2>
									<p className="text-gray-700 font-medium">
										{gameWon || gameData?.hasWonToday
											? `Correct! It was ${answerStudio.name}`
											: `The answer was ${answerStudio.name}.`}
									</p>
								</div>
							</div>
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
							>
								<p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
									{label}
								</p>
								<p className="text-lg font-black text-gray-900 leading-tight">
									{idx <= guesses.length || isGameOver
										? getHintValue(idx)
										: 'LOCKED'}
								</p>
							</div>
						))}
					</div>
				</div>

				<aside className="w-full lg:w-80">
					<div className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8">
						<div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-4">
							<Trophy className="w-5 h-5 text-yellow-500" />
							<h2 className="text-xl font-bold uppercase tracking-tighter">
								Leaderboard
							</h2>
						</div>
						<div className="space-y-3">
							{leaderboard.map((user, idx) => (
								<div
									key={user.id}
									className="flex justify-between items-center p-3 border-2 border-black rounded-lg bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
								>
									<div className="flex flex-col min-w-0">
										<span className="font-bold text-sm truncate">
											{idx + 1}. {user.name ?? 'Anon'}
										</span>
										<span className="text-[10px] text-gray-500 uppercase font-semibold">
											{user.studioTotalTries} tries
										</span>
									</div>
									<div className="bg-black text-white px-2 py-1 rounded text-xs font-bold shrink-0">
										{user.studioWins}W
									</div>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
