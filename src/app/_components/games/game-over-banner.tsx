'use client';

import { XCircle, CheckCircle2 } from 'lucide-react';

interface GameOverBannerProps {
	won: boolean;
	answer: string;
	tries?: number;
	onShare?: () => void;
	shareButtonText?: string;
	isShareCopied?: boolean;
	gameType?: 'wordle' | 'studio';
}

export default function GameOverBanner({
	won,
	answer,
	tries,
	onShare,
	shareButtonText = 'SHARE RESULTS',
	isShareCopied = false,
	gameType = 'wordle',
}: GameOverBannerProps) {
	const winMessages =
		gameType === 'studio'
			? {
					title: 'Contract Signed!',
					subtitle: `Correct! It was ${answer}`,
				}
			: {
					title: 'Journey Complete!',
					subtitle: `You identified ${answer} in ${tries ?? 0} tries.`,
				};

	const lossMessages =
		gameType === 'studio'
			? {
					title: 'Studio Closed',
					subtitle: `The answer was ${answer}.`,
				}
			: {
					title: 'Out of Guesses',
					subtitle: `The answer was ${answer}.`,
				};

	const messages = won ? winMessages : lossMessages;

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
						{messages.title}
					</h2>
					<p className="text-gray-700">{messages.subtitle}</p>
				</div>
			</div>

			{onShare && (
				<button
					onClick={onShare}
					className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all ${
						isShareCopied ? 'bg-green-400' : 'bg-white'
					}`}
					aria-label={isShareCopied ? 'Results copied!' : 'Share results'}
				>
					{isShareCopied ? 'COPIED!' : shareButtonText}
				</button>
			)}
		</div>
	);
}

