'use client';

import { useState, useCallback } from 'react';
import AnimeWordle from '../_components/anime-wordle';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';
import AnimeSearch, { type AnimeSelection } from '../_components/anime-search';
import WordleHints from '../_components/wordle-hints';
import type { WordleHintData } from '~/lib/game-types';

export default function WordlePage() {
	const [selectedAnimeId, setSelectedAnimeId] = useState<
		string | undefined
	>();
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);
	const [isGameLoading, setIsGameLoading] = useState(true);
	const [guessCount, setGuessCount] = useState(0);
	const [hintData, setHintData] = useState<WordleHintData | null>(null);

	const isGameOver = gameWon || gameFailed;

	const handleSelect = (selection: AnimeSelection) => {
		if (!isGameOver && selection.id !== selectedAnimeId) {
			setSelectedAnimeId(selection.id);
		}
	};

	const handleGuessCountChange = useCallback((count: number) => {
		setGuessCount(count);
	}, []);

	const handleHintDataChange = useCallback((data: WordleHintData | null) => {
		setHintData(data);
	}, []);

	return (
		<GameErrorBoundary>
			<main className="min-h-screen">
				<GameHeader gameType="wordle" />
				{!isGameLoading && hintData && (
					<WordleHints
						guessCount={guessCount}
						isGameOver={isGameOver}
						title={hintData.title}
						description={hintData.description}
						characters={hintData.characters}
						image={hintData.image}
					/>
				)}
				{!isGameLoading && !isGameOver && (
					<AnimeSearch onSelect={handleSelect} disabled={false} />
				)}
				<AnimeWordle
					searchedAnimeId={selectedAnimeId}
					gameWon={gameWon}
					setGameWon={setGameWon}
					setGameFailed={setGameFailed}
					onLoadingChange={setIsGameLoading}
					onGuessCountChange={handleGuessCountChange}
					onHintDataChange={handleHintDataChange}
				/>
			</main>
		</GameErrorBoundary>
	);
}
