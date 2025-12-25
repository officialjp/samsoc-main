'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

type GameType = 'wordle' | 'studio' | 'banner';

interface GameHeaderProps {
	gameType: GameType;
}

interface GameInfo {
	title: string;
	tagline: string;
	howToPlay: string[];
	tips: string[];
}

const GAME_INFO: Record<GameType, GameInfo> = {
	wordle: {
		title: 'Anime Wordle',
		tagline: 'Guess the mystery anime from its attributes',
		howToPlay: [
			'Search for any anime to make a guess',
			"After each guess, you'll see how your guess compares to the answer",
			'Green means an exact match, yellow means a partial match, red means no match',
			'Use the clues to narrow down your next guess',
			'You have 12 attempts to find the correct anime',
		],
		tips: [
			'Pay attention to the year and season for quick elimination',
			'Studios and genres can help narrow down significantly',
			'If the score is close, you might be on the right track!',
		],
	},
	studio: {
		title: 'Studio Guesser',
		tagline: 'Identify the anime studio from progressive hints',
		howToPlay: [
			"You'll receive hints about a mystery anime studio",
			'Each wrong guess reveals an additional hint',
			'Hints include: average rating, active years, top genres, notable characters, and popular shows',
			'Search and select the studio you think matches the hints',
			'You have 5 attempts to guess the correct studio',
		],
		tips: [
			'The year range can help identify older vs newer studios',
			'Character names are often very telling - look for iconic ones',
			"If you recognise any anime titles, that's usually a giveaway!",
		],
	},
	banner: {
		title: 'Zoomed-In Banner',
		tagline: 'Identify the anime from a cropped image',
		howToPlay: [
			"You'll see a heavily zoomed-in portion of an anime banner",
			'Search for the anime you think it belongs to',
			'Each wrong guess zooms out the image slightly, revealing more',
			'Try to guess before the full image is revealed',
			'You have 5 attempts to identify the anime',
		],
		tips: [
			'Look for distinctive colours or character features',
			'Art style can hint at the era or studio',
			'Sometimes text or logos are visible - use them!',
		],
	},
};

export default function GameHeader({ gameType }: GameHeaderProps) {
	const [showHelp, setShowHelp] = useState(false);
	const info = GAME_INFO[gameType];

	return (
		<>
			<div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
							{info.title}
						</h1>
						<p className="text-gray-600 font-medium mt-1">
							{info.tagline}
						</p>
					</div>
					<button
						onClick={() => setShowHelp(true)}
						className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:cursor-pointer self-start sm:self-auto"
						aria-label="How to play"
					>
						<HelpCircle className="w-4 h-4" />
						How to Play
					</button>
				</div>
			</div>

			{/* Help Modal */}
			{showHelp && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
					onClick={() => setShowHelp(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="help-title"
				>
					<div
						className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-6 border-b-2 border-black">
							<h2
								id="help-title"
								className="text-2xl font-black text-gray-900"
							>
								How to Play
							</h2>
							<button
								onClick={() => setShowHelp(false)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:cursor-pointer"
								aria-label="Close"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="p-6 space-y-6">
							{/* Rules */}
							<div>
								<h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-3">
									Rules
								</h3>
								<ol className="space-y-2">
									{info.howToPlay.map((step, idx) => (
										<li
											key={idx}
											className="flex gap-3 text-gray-700"
										>
											<span className="shrink-0 w-6 h-6 bg-purple-200 border-2 border-black rounded-full flex items-center justify-center text-xs font-black">
												{idx + 1}
											</span>
											<span>{step}</span>
										</li>
									))}
								</ol>
							</div>

							{/* Tips */}
							<div>
								<h3 className="text-sm font-black uppercase tracking-wider text-gray-500 mb-3">
									Tips
								</h3>
								<ul className="space-y-2">
									{info.tips.map((tip, idx) => (
										<li
											key={idx}
											className="flex gap-3 text-gray-700"
										>
											<span className="shrink-0 text-yellow-500">
												💡
											</span>
											<span>{tip}</span>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="p-6 border-t-2 border-black bg-gray-50">
							<button
								onClick={() => setShowHelp(false)}
								className="w-full py-3 bg-purple-200 border-2 border-black rounded-xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all hover:cursor-pointer"
							>
								Got it!
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
