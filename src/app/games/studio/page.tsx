'use client';

import { useState } from 'react';
import StudioSearch from '../_components/studio-search';
import StudioGame from '../_components/anime-studio';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';

export default function StudioPage() {
	const [selectedStudioId, setSelectedStudioId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);

	const isGameOver = gameWon || gameFailed;

	const handleSelect = (id: string) => {
		if (!isGameOver && id !== selectedStudioId) {
			setSelectedStudioId(id);
		}
	};

	return (
		<GameErrorBoundary>
			<main className="min-h-screen py-12">
				<GameHeader gameType="studio" />
				{!isGameOver && (
					<div className="mb-8">
						<StudioSearch
							onSelect={handleSelect}
							disabled={false}
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
	);
}
