'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import posthog from 'posthog-js';
import { Button } from '~/components/ui/button';

export function MembershipSignupButton() {
	const handleClick = () => {
		posthog.capture('membership_signup_clicked', {
			destination_url:
				'https://surreyunion.org/your-activity/clubs-and-societies-a-z/anime-manga-society',
		});
	};

	return (
		<Button
			asChild
			className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer hover:bg-button1"
		>
			<Link
				href="https://surreyunion.org/your-activity/clubs-and-societies-a-z/anime-manga-society"
				onClick={handleClick}
			>
				<UserPlus className="mr-2 h-4 w-4" />
				View Sign-Up Page
			</Link>
		</Button>
	);
}
