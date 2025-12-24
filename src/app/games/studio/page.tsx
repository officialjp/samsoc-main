'use client';

import { useState } from 'react';
import StudioSearch from '~/app/_components/games/studio-search';
import StudioGame from '~/app/_components/games/anime-studio';
import { GameErrorBoundary } from '~/app/_components/games/error-boundary';
import AuthGate from '~/app/_components/games/auth-gate';
import { api } from '~/trpc/react';
import GameHeader from '~/app/_components/games/game-header';

export default function StudioPage() {
	const [selectedStudioId, setSelectedStudioId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);

	const { data: gameData, isLoading: gameLoading } =
		api.studio.getAnswerStudio.useQuery(undefined, {
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		});

	const isGameOver =
		gameWon ||
		gameFailed ||
		!!gameData?.hasWonToday ||
		!!gameData?.hasFailedToday;

	const handleSelect = (id: string) => {
		if (!isGameOver && id !== selectedStudioId) {
			setSelectedStudioId(id);
		}
	};

	return (
		<AuthGate
			loadingMessage="Syncing Studio Data..."
			isGameDataLoading={gameLoading}
		>
			<GameErrorBoundary>
				<main className="min-h-screen py-12">
					<GameHeader gameType="studio" />
					{!isGameOver && (
						<div className="mb-8">
							<StudioSearch
								onSelect={handleSelect}
								disabled={gameLoading}
							/>
						</div>
					)}
					<StudioGame
						selectedStudioId={selectedStudioId}
						gameWon={gameWon}
						setGameWon={setGameWon}
						setGameFailed={setGameFailed}
					/>
				</main>
			</GameErrorBoundary>
		</AuthGate>
	);
}
