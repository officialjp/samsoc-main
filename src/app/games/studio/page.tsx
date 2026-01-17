'use client';

import { useState } from 'react';
import StudioSearch from '../_components/studio-search';
import StudioGame from '../_components/anime-studio';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';

export default function StudioPage() {
	// Track the full selection object from the updated Search component
	const [selectedStudio, setSelectedStudio] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);
	const [isGameLoading, setIsGameLoading] = useState(true);

	const isGameOver = gameWon || gameFailed;

	const handleSelect = (selection: { id: string; name: string }) => {
		if (!isGameOver) {
			setSelectedStudio(selection);
		}
	};

	return (
		<GameErrorBoundary>
			<main className="min-h-screen py-12">
				<GameHeader gameType="studio" />
				{!isGameLoading && !isGameOver && (
					<div className="mb-12">
						<StudioSearch
							onSelect={handleSelect}
							disabled={false}
						/>
					</div>
				)}
				<StudioGame
					selectedStudio={selectedStudio}
					gameWon={gameWon}
					setGameWon={setGameWon}
					setGameFailed={setGameFailed}
					onLoadingChange={setIsGameLoading}
				/>
			</main>
		</GameErrorBoundary>
	);
}
