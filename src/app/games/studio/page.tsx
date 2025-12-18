'use client';

import { useState, Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Loader2, Lock } from 'lucide-react';
import StudioSearch from '~/app/_components/games/studio-search';
import StudioGame from '~/app/_components/games/anime-studio';
import { api } from '~/trpc/react';

function StudioGameContent() {
	const [selectedStudioId, setSelectedStudioId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);

	const { status } = useSession();

	const { data: gameData, isLoading: gameLoading } =
		api.studio.getAnswerStudio.useQuery(undefined, {
			enabled: status === 'authenticated',
		});

	if (status === 'loading' || (status === 'authenticated' && gameLoading)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
				<p className="font-bold text-gray-700 uppercase tracking-tighter">
					Syncing Studio Data...
				</p>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
				<div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md">
					<Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
					<h2 className="text-2xl font-black mb-2 uppercase italic">
						LOGIN REQUIRED!
					</h2>
					<p className="text-gray-600 mb-6 font-medium">
						You must be logged in to track your studio streaks and
						climb the leaderboard.
					</p>
					<button
						onClick={() => void signIn()}
						className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
					>
						LOG IN TO PLAY
					</button>
				</div>
			</div>
		);
	}

	const isGameOver =
		gameWon ||
		gameFailed ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday;

	const handleSelect = (id: string) => {
		setSelectedStudioId(id);
		setTimeout(() => setSelectedStudioId(undefined), 100);
	};

	return (
		<main className="min-h-screen py-12">
			{!isGameOver && (
				<div className="mb-8">
					<StudioSearch onSelect={handleSelect} />
				</div>
			)}
			<StudioGame
				selectedStudioId={selectedStudioId}
				gameWon={gameWon}
				setGameWon={setGameWon}
				setGameFailed={setGameFailed}
			/>
		</main>
	);
}

export default function StudioPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
				</div>
			}
		>
			<StudioGameContent />
		</Suspense>
	);
}
