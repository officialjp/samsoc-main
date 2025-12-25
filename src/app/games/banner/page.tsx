'use client';

import { useState } from 'react';
import ZoomedInBanner from '../_components/zoomed-in-banner';
import { GameErrorBoundary } from '../_components/error-boundary';
import AuthGate from '../_components/auth-gate';
import { api } from '~/trpc/react';
import GameHeader from '../_components/game-header';

function BannerContent() {
	const [gameWon, setGameWon] = useState(false);
	const [gameFailed, setGameFailed] = useState(false);

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
					/>
				</main>
			</GameErrorBoundary>
		</AuthGate>
	);
}

export default function BannerPage() {
	return <BannerContent />;
}
