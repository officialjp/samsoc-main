'use client';

import { AlertCircle } from 'lucide-react';

interface DailyNotFoundProps {
	gameType: 'anime' | 'studio' | 'banner';
}

export default function DailyNotFound({ gameType }: DailyNotFoundProps) {
	const gameNames = {
		anime: 'Anime Wordle',
		studio: 'Studio Guesser',
		banner: 'Zoomed-In Banner',
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
			<div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md text-center">
				<AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
				<h2 className="text-2xl font-black mb-2 uppercase italic text-gray-900">
					NO DAILY {gameType.toUpperCase()} SET
				</h2>
				<p className="text-gray-700 mb-4 font-medium">
					The daily {gameNames[gameType]} hasn&apos;t been scheduled for
					today yet.
				</p>
				<p className="text-sm text-gray-600">
					Check back later or contact an admin to schedule today&apos;s
					challenge!
				</p>
			</div>
		</div>
	);
}
