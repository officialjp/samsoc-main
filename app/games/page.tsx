import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';

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
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="GAMES"
						title="SAMsoc Games"
						description="We host a variety of online games and quizzes at our regular session to give you something to do during breaks. Feel free to join in and potentially win some prizes!"
						badgeColor="bg-purple-200"
						className="mb-12"
					/>
					<h1>
						THIS DOESNT WORK YET!!! BUT TUNE IN COZ IT MIGHT MAYBE
						PERCHANCE WILL
					</h1>
				</SectionContainer>
			</main>
		</div>
	);
}
