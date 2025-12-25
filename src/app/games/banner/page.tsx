'use client';

import { useState } from 'react';
import ZoomedInBanner from '../_components/zoomed-in-banner';
import { GameErrorBoundary } from '../_components/game-error-boundary';
import AuthGate from '../_components/auth-gate';
import { api } from '~/trpc/react';
import GameHeader from '../_components/game-header';

function BannerContent() {
	const [gameWon, setGameWon] = useState(false);
	const [searchedAnimeId, setSearchedAnimeId] = useState<
		string | undefined
	>();

	// No-op function for setGameFailed since banner game handles game-over state internally
	const setGameFailed = (_failed: boolean) => {
		// Banner game handles game-over state internally
		void 0;
	};

	const { isLoading: gameLoading } = api.anime.getBannerAnswerAnime.useQuery(
		undefined,
		{
			staleTime: 1000 * 60 * 5,
			refetchOnWindowFocus: false,
		},
	);

	return (
		<AuthGate
			loadingMessage="Loading Game State..."
			isGameDataLoading={gameLoading}
		>
			<GameErrorBoundary>
				<main className="min-h-screen">
					<GameHeader gameType="banner" />
					<ZoomedInBanner
						gameWon={gameWon}
						setGameWon={setGameWon}
						setGameFailed={setGameFailed}
						searchedAnimeId={searchedAnimeId}
						setSearchedAnimeId={setSearchedAnimeId}
					/>
				</main>
			</GameErrorBoundary>
		</AuthGate>
	);
}

export default function BannerPage() {
	return <BannerContent />;
}
