import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import CalendarWithData from '@/components/calendar/calendar-client'; // Assuming CalendarWithData is in the same directory

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
	description:
		'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
	},
};

export default function CalendarPage() {
	return (
		<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="SCHEDULE"
						title="Event Calendar"
						description="Browse our upcoming events and regular anime screenings. Click on any event for more details!"
						badgeColor="bg-purple-200"
						className="mb-12"
					/>

					<CalendarWithData />
				</SectionContainer>
			</main>
		</div>
	);
}
