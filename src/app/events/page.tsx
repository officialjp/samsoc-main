import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { EventTypeCard } from '~/app/_components/events/event-type-card';
import ClubNight from '../../../public/images/clubnight.avif';
import ComicCon from '../../../public/images/comiccon.avif';
import Screenings from '../../../public/images/screenings.avif';
import Collabs from '../../../public/images/collabs.avif';

import type { Metadata } from 'next';
import type { StaticImageData } from 'next/image';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
	description:
		"Discover the wide range of events we host throughout the academic year. From weekly screenings to special collaborations, there's something for every anime enthusiast!",
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			"Discover the wide range of events we host throughout the academic year. From weekly screenings to special collaborations, there's something for every anime enthusiast!",
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			"Discover the wide range of events we host throughout the academic year. From weekly screenings to special collaborations, there's something for every anime enthusiast!",
	},
};

interface EventType {
	title: string;
	description: string;
	frequency: string;
	image: StaticImageData;
	color: string;
	examples: string[];
}

export default function EventsPage() {
	const eventTypes: EventType[] = [
		{
			title: 'Social Nights',
			description:
				'Let loose and have fun! Our social nights range from karaoke sessions, to club nights and even bar crawls around Guildford. These events are perfect for making new friends in a fun atmosphere.',
			frequency: 'Monthly',
			image: ClubNight,
			color: 'bg-pink-200',
			examples: ['Anime Karaoke Night', 'Club Night', 'Bar Crawl'],
		},
		{
			title: 'Screenings',
			description:
				'The heart of our society! Join us for regular screenings of both classic and current anime series and films.',
			frequency: 'Weekly (Wednesday)',
			image: Screenings,
			color: 'bg-about1',
			examples: [
				'Regular Screenings',
				'Movie Night',
				'Final Session Showcase',
			],
		},
		{
			title: 'Creative Collaborations',
			description:
				'We regularly team up with other societies for special cross-over events! From art workshops with the Art Society to themed game nights with the Gaming Society, these collaborations offer unique experiences that combine different interests and bring communities together.',
			frequency: 'Bi-monthly',
			image: Collabs,
			color: 'bg-purple-200',
			examples: ['Games Night', 'Art Night', 'Club Night'],
		},
		{
			title: 'Convention Trips',
			description:
				'Experience the excitement of anime conventions with fellow fans! We organize group trips to major conventions, offering discounted tickets, and shared transportation. These trips are highlights of our year and provide unforgettable memories.',
			frequency: '2-3 times per year',
			image: ComicCon,
			color: 'bg-green-200',
			examples: ['MCM ComiCon'],
		},
	];

	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="ACTIVITIES"
						title="Our Events"
						description="Discover the wide range of events we host throughout the academic year. From weekly screenings to special collaborations, there's something for every anime enthusiast!"
						badgeColor="bg-purple-200"
						className="mb-12"
					/>

					<div className="space-y-8">
						{eventTypes.map((event, index) => (
							<EventTypeCard
								className={``}
								key={index}
								title={event.title}
								description={event.description}
								frequency={event.frequency}
								image={event.image.src}
								color={event.color}
								examples={event.examples}
							/>
						))}
					</div>
				</SectionContainer>
			</main>
		</div>
	);
}
