'use client';

import { useState } from 'react';
import AnimeSearch from '~/app/_components/games/search-component';
import AnimeWordle from '~/app/_components/games/anime-wordle';
import { GameErrorBoundary } from '~/app/_components/games/error-boundary';
import AuthGate from '~/app/_components/games/auth-gate';
import { api } from '~/trpc/react';
import GameHeader from '~/app/_components/games/game-header';

export default function WordlePage() {
	const [selectedAnimeId, setSelectedAnimeId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);

	const { data: gameData, isLoading: gameLoading } =
		api.anime.getAnswerAnime.useQuery(undefined, {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		});

	const isGameOver =
		gameWon ||
		gameFailed ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday;

	const handleSelect = (id: string) => {
		if (!isGameOver && id !== selectedAnimeId) {
			setSelectedAnimeId(id);
		}
	};

	return (
		<AuthGate
			loadingMessage="Loading Game State..."
			isGameDataLoading={gameLoading}
		>
			<GameErrorBoundary>
				<main className="min-h-screen">
					<GameHeader gameType="wordle" />
					{!isGameOver && (
						<AnimeSearch
							onSelect={handleSelect}
							disabled={gameLoading}
						/>
					)}
					<AnimeWordle
						searchedAnimeId={selectedAnimeId}
						gameWon={gameWon}
						setGameWon={setGameWon}
						setGameFailed={setGameFailed}
					/>
				</main>
			</GameErrorBoundary>
		</AuthGate>
	);
}
