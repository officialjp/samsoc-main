'use client';

import { useState } from 'react';
import StudioSearch from '../_components/studio-search';
import StudioGame from '../_components/anime-studio';
import { GameErrorBoundary } from '../_components/error-boundary';
import AuthGate from '../_components/auth-gate';
import { api } from '~/trpc/react';
import GameHeader from '../_components/game-header';

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
