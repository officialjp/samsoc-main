'use client';

import { useState, Suspense } from 'react'; // 1. Import Suspense
import { useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Loader2, Lock } from 'lucide-react';
import AnimeSearch from '../../_components/games/search-component';
import AnimeWordle from '../../_components/games/anime-wordle';
import { api } from '~/trpc/react';

function WordleContent() {
	const searchParams = useSearchParams();
	const animeId = searchParams.get('animeId');
	const [gameWon, setGameWon] = useState(false);

	const { status } = useSession();

	const { data: gameData, isLoading: gameLoading } =
		api.anime.getAnswerAnime.useQuery(undefined, {
			enabled: status === 'authenticated',
		});

	if (status === 'loading' || (status === 'authenticated' && gameLoading)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
				<p className="font-bold text-gray-700">Loading Game State...</p>
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
						You must be logged in to track your daily wins and climb
						the leaderboard.
					</p>
					<button
						onClick={() => void signIn()}
						className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl border-2 hover:cursor-pointer border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
					>
						LOG IN TO PLAY
					</button>
				</div>
			</div>
		);
	}

	const isGameOver =
		gameWon || !!gameData?.hasWonToday || !!gameData?.hasFailedToday;

	return (
		<main className="min-h-screen">
			{!isGameOver && <AnimeSearch />}
			<AnimeWordle
				searchedAnimeId={animeId ?? undefined}
				gameWon={gameWon}
				setGameWon={setGameWon}
			/>
		</main>
	);
}

// 3. Keep the Page component as the entry point with Suspense
export default function WordlePage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-screen">
					<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
				</div>
			}
		>
			<WordleContent />
		</Suspense>
	);
}
