'use client';

import { signIn } from '~/lib/auth-client';
import { Lock } from 'lucide-react';
import { captureEvent } from '~/lib/posthog-client';

interface LoginPromptProps {
	/** The message to display to the user */
	message?: string;
	/** The title of the prompt */
	title?: string;
	/** Whether to show as a modal overlay or inline */
	variant?: 'modal' | 'inline';
	/** Callback when the user dismisses the prompt (only for modal variant) */
	onDismiss?: () => void;
}

/**
 * A reusable login prompt component that can be displayed when
 * authentication is required to perform an action.
 */
export default function LoginPrompt({
	message = 'You must be logged in to track your daily wins and climb the leaderboard.',
	title = 'Login Required',
	variant = 'inline',
	onDismiss,
}: LoginPromptProps) {
	const handleLogin = () => {
		captureEvent('login_initiated', {
			provider: 'discord',
			prompt_variant: variant,
		});
		void signIn.social({ provider: 'discord' });
	};

	const handleSkipLogin = () => {
		captureEvent('login_skipped', {
			prompt_variant: variant,
		});
		onDismiss?.();
	};

	const content = (
		<div className="bg-white border-4 border-black p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
			<Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
			<h2 className="text-2xl font-black mb-2 uppercase italic text-center">
				{title}
			</h2>
			<p className="text-gray-600 mb-6 font-medium text-center">
				{message}
			</p>
			<button
				onClick={handleLogin}
				className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl border-2 hover:cursor-pointer border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
			>
				LOG IN WITH DISCORD
			</button>
			{variant === 'modal' && onDismiss && (
				<button
					onClick={handleSkipLogin}
					className="w-full mt-3 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
				>
					CONTINUE WITHOUT LOGIN
				</button>
			)}
		</div>
	);

	if (variant === 'modal') {
		return (
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
				role="dialog"
				aria-modal="true"
				aria-labelledby="login-prompt-title"
			>
				<div
					className="absolute inset-0"
					onClick={onDismiss}
					aria-hidden="true"
				/>
				<div className="relative">{content}</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
			{content}
		</div>
	);
}
