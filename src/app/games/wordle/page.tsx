'use client';

import { useState } from 'react';
import AnimeWordle from '../_components/anime-wordle';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';
import AnimeSearch, { type AnimeSelection } from '../_components/anime-search';

export default function WordlePage() {
	const [selectedAnimeId, setSelectedAnimeId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);
	const [isGameLoading, setIsGameLoading] = useState(true);

	const isGameOver = gameWon || gameFailed;

	const handleSelect = (selection: AnimeSelection) => {
		if (!isGameOver && selection.id !== selectedAnimeId) {
			setSelectedAnimeId(selection.id);
		}
	};

	return (
		<GameErrorBoundary>
			<main className="min-h-screen">
				<GameHeader gameType="wordle" />
				{!isGameLoading && !isGameOver && (
					<AnimeSearch onSelect={handleSelect} disabled={false} />
				)}
				<AnimeWordle
					searchedAnimeId={selectedAnimeId}
					gameWon={gameWon}
					setGameWon={setGameWon}
					setGameFailed={setGameFailed}
					onLoadingChange={setIsGameLoading}
				/>
			</main>
		</GameErrorBoundary>
	);
}
