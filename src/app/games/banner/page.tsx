'use client';

import { useState } from 'react';
import ZoomedInBanner from '../_components/zoomed-in-banner';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';
import AnimeSearch, { type AnimeSelection } from '../_components/anime-search';

export default function BannerPage() {
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);
	const [searchedAnime, setSearchedAnime] = useState<
		AnimeSelection | undefined
	>();
	const [isGameLoading, setIsGameLoading] = useState(true);

	const isGameOver = gameWon || gameFailed;

	return (
		<GameErrorBoundary>
			<main className="min-h-screen">
				<GameHeader gameType="banner" />
				{!isGameLoading && !isGameOver && (
					<AnimeSearch onSelect={setSearchedAnime} disabled={false} />
				)}
				<ZoomedInBanner
					gameWon={gameWon}
					setGameWon={setGameWon}
					setGameFailed={setGameFailed}
					searchedAnime={searchedAnime}
					setSearchedAnime={setSearchedAnime}
					onLoadingChange={setIsGameLoading}
				/>
			</main>
		</GameErrorBoundary>
	);
}
