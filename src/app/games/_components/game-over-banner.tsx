'use client';

import { XCircle, CheckCircle2 } from 'lucide-react';

type GameType = 'wordle' | 'studio' | 'banner';

interface GameOverBannerProps {
	won: boolean;
	answer: string;
	tries?: number;
	onShare?: () => void;
	shareButtonText?: string;
	isShareCopied?: boolean;
	gameType?: GameType;
}

const GAME_MESSAGES: Record<
	GameType,
	{
		win: {
			title: string;
			subtitle: (answer: string, tries: number) => string;
		};
		loss: { title: string; subtitle: (answer: string) => string };
	}
> = {
	wordle: {
		win: {
			title: 'Journey Complete!',
			subtitle: (answer, tries) =>
				`You identified ${answer} in ${tries} tries.`,
		},
		loss: {
			title: 'Out of Guesses',
			subtitle: (answer) => `The answer was ${answer}.`,
		},
	},
	studio: {
		win: {
			title: 'Contract Signed!',
			subtitle: (answer) => `Correct! It was ${answer}`,
		},
		loss: {
			title: 'Studio Closed',
			subtitle: (answer) => `The answer was ${answer}.`,
		},
	},
	banner: {
		win: {
			title: 'Sharp Eyes!',
			subtitle: (answer, tries) =>
				`You spotted ${answer} in ${tries} ${tries === 1 ? 'guess' : 'guesses'}!`,
		},
		loss: {
			title: 'Zoomed Out',
			subtitle: (answer) => `The anime was ${answer}.`,
		},
	},
};

export default function GameOverBanner({
	won,
	answer,
	tries = 0,
	onShare,
	shareButtonText = 'SHARE RESULTS',
	isShareCopied = false,
	gameType = 'wordle',
}: GameOverBannerProps) {
	const messages = GAME_MESSAGES[gameType];
	const currentMessage = won ? messages.win : messages.loss;

	return (
		<div
			className={`border-2 border-black rounded-2xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6 ${
				won ? 'bg-green-50' : 'bg-red-50'
			}`}
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start gap-4">
				{won ? (
					<CheckCircle2
						className="w-8 h-8 text-green-600 shrink-0"
						aria-hidden="true"
					/>
				) : (
					<XCircle
						className="w-8 h-8 text-red-600 shrink-0"
						aria-hidden="true"
					/>
				)}
				<div>
					<h2 className="text-2xl font-bold text-gray-900">
						{currentMessage.title}
					</h2>
					<p className="text-gray-700">
						{currentMessage.subtitle(answer, tries)}
					</p>
				</div>
			</div>

			{onShare && (
				<button
					onClick={onShare}
					className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all hover:cursor-pointer ${
						isShareCopied ? 'bg-green-400' : 'bg-white'
					}`}
					aria-label={
						isShareCopied ? 'Results copied!' : 'Share results'
					}
				>
					{isShareCopied ? 'COPIED!' : shareButtonText}
				</button>
			)}
		</div>
	);
}
