'use client';

import { useState } from 'react';
import ZoomedInBanner from '../_components/zoomed-in-banner';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import GameHeader from '../_components/game-header';
import type { AnimeSelection } from '../_components/anime-search';

export default function BannerPage() {
	const [gameWon, setGameWon] = useState(false);
	const [searchedAnime, setSearchedAnime] = useState<
		AnimeSelection | undefined
	>();

	const setGameFailed = (_failed: boolean) => {
		// Banner game handles game-over state internally
		void 0;
	};

	return (
		<GameErrorBoundary>
			<main className="min-h-screen">
				<GameHeader gameType="banner" />
				<ZoomedInBanner
					gameWon={gameWon}
					setGameWon={setGameWon}
					setGameFailed={setGameFailed}
					searchedAnime={searchedAnime}
					setSearchedAnime={setSearchedAnime}
				/>
			</main>
		</GameErrorBoundary>
	);
}
