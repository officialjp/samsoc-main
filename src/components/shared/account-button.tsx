'use client';

import { useRef } from 'react';
import { useSession, signIn, signOut } from '~/lib/auth-client';
import Image from 'next/image';
import posthog from 'posthog-js';

export default function AccountButton() {
	const { data: session, isPending } = useSession();
	const hasIdentifiedRef = useRef(false);

	// Identify user with PostHog when session is available
	if (session?.user && !hasIdentifiedRef.current) {
		hasIdentifiedRef.current = true;
		posthog.identify(session.user.id, {
			email: session.user.email,
			name: session.user.name,
		});
	}

	// Reset when user logs out
	if (!session && !isPending && hasIdentifiedRef.current) {
		hasIdentifiedRef.current = false;
		posthog.reset();
	}

	const handleSignOut = () => {
		posthog.capture('user_logged_out');
		posthog.reset();
		void signOut();
	};

	const handleSignIn = () => {
		posthog.capture('login_initiated', {
			provider: 'discord',
			prompt_variant: 'header',
		});
		void signIn.social({ provider: 'discord' });
	};

	if (isPending) {
		return (
			<div className="flex flex-row justify-center items-center gap-2">
				<div className="bg-gray-300 animate-pulse py-1 px-4 rounded-3xl w-20 h-8"></div>
			</div>
		);
	}

	if (session) {
		return (
			<div className="flex flex-row justify-center items-center gap-2">
				<button
					className="bg-button2 hover:bg-button1 text-white py-1 px-4 rounded-3xl text-nowrap hover:cursor-pointer"
					onClick={handleSignOut}
				>
					Sign out
				</button>
				<div className="relative w-10 h-10 flex items-center justify-center font-bold rounded-full overflow-hidden shrink-0 shadow-[0,0,0px_#000000ff] hover:shadow-[0_0_10px_#00000040] active:shadow-[0_0_4px_#000000a0] hover:scale-110 active:duration-50 active:scale-105 transition duration-300">
					<Image
						alt={session.user.id}
						src={session.user.image ?? '/placeholder.svg'}
						width={40}
						height={40}
						className="absolute shrink-0 w-full h-full"
						draggable={false}
					></Image>
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-row justify-center items-center gap-2">
			<p>Not signed in?</p>
			<button
				className="bg-button2 hover:bg-button1 text-white py-1 px-4 rounded-3xl hover:cursor-pointer"
				onClick={handleSignIn}
			>
				Sign in
			</button>
		</div>
	);
}
