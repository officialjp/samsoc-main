'use client';

import { useSession, signIn } from 'next-auth/react';
import { Loader2, Lock } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthGateProps {
	children: ReactNode;
	loadingMessage?: string;
	isGameDataLoading?: boolean;
}

/**
 * Shared authentication gate component for game pages.
 * Handles authentication state and displays appropriate UI for:
 * - Loading state (session check + optional game data loading)
 * - Unauthenticated state (login prompt)
 * - Authenticated state (renders children)
 */
export default function AuthGate({
	children,
	loadingMessage = 'Loading Game State...',
	isGameDataLoading = false,
}: AuthGateProps) {
	const { status } = useSession();

	// Show loading state during session check or game data loading
	if (status === 'loading' || (status === 'authenticated' && isGameDataLoading)) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 animate-spin text-blue-600" />
				<p className="font-bold text-gray-700 uppercase tracking-tighter">
					{loadingMessage}
				</p>
			</div>
		);
	}

	// Show login prompt for unauthenticated users
	if (status === 'unauthenticated') {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
				<div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md">
					<Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
					<h2 className="text-2xl font-black mb-2 uppercase italic">
						LOGIN REQUIRED!
					</h2>
					<p className="text-gray-600 mb-6 font-medium">
						You must be logged in to track your daily wins and climb
						the leaderboard.
					</p>
					<button
						onClick={() => void signIn()}
						className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl border-2 hover:cursor-pointer border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
					>
						LOG IN TO PLAY
					</button>
				</div>
			</div>
		);
	}

	// Render game content for authenticated users
	return <>{children}</>;
}
