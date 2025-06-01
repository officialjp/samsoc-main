import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { EventTypeCard } from '@/components/event/event-type-card';
import { Button } from '@/components/ui/button';
import ClubNight from '@/public/images/clubnight.jpg';
import ComicCon from '@/public/images/comiccon.jpg';
import Pokemon from '@/public/images/pokemon.png';
import Voting from '@/public/images/voting.png';
import Filipino from '@/public/images/filipino.webp';
import Art from '@/public/images/art.webp';
import SVGS from '@/public/images/svgs.webp';

// Import the shared types
import { EventType } from '@/lib/definitions'; // Adjust the path as needed
import { Metadata } from 'next';

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

export default function EventsPage() {
	// Event types data
	const eventTypes: EventType[] = [
		{
			title: 'Social Nights',
			description:
				'Let loose and have fun! Our social nights range from karaoke sessions, to club nights and even bar crawls around Guildford. These events are perfect for making new friends in a fun atmosphere.',
			frequency: 'Monthly',
			image: ClubNight, // No need for explicit casting with the shared type
			color: 'bg-pink-200',
			examples: ['Anime Karaoke Night', 'Club Night', 'Bar Crawl'],
		},
		{
			title: 'Screenings',
			description:
				'The heart of our society! Join us for regular screenings of both classic and current anime series and films.',
			frequency: 'Weekly (Wednesday)',
			collageImage: [
				{
					src: Pokemon,
					alt: 'pokemon',
					dimentions: {
						x: 300,
						y: 300,
					},
				},
				{
					src: Voting,
					alt: 'voting',
					dimentions: {
						x: 300,
						y: 300,
					},
				},
			],
			color: 'bg-about1',
			examples: [
				'Regular Screenings',
				'Movie Night',
				'Final Session Showcase',
			],
		},
		// {
		//   title: "Cosplay Workshops & Contests",
		//   description:
		//     "Showcase your creativity or learn how to bring your favorite characters to life! Our cosplay events include beginner-friendly workshops where you can learn techniques from experienced cosplayers, as well as contests where you can show off your amazing creations.",
		//   frequency: "Once per semester",
		//   image: "/placeholder.svg?height=400&width=300&text=Cosplay+Events",
		//   color: "bg-yellow-200",
		//   examples: [
		//     "Spring Cosplay Contest",
		//     "Makeup Workshop",
		//     "Prop Making 101",
		//     "Costume Repair Station",
		//   ],
		// },
		{
			title: 'Creative Collaborations',
			description:
				'We regularly team up with other societies for special cross-over events! From art workshops with the Art Society to themed game nights with the Gaming Society, these collaborations offer unique experiences that combine different interests and bring communities together.',
			frequency: 'Bi-monthly',
			collageImage: [
				{
					src: Art,
					alt: 'art',
					dimentions: {
						x: 300,
						y: 300,
					},
				},
				{
					src: SVGS,
					alt: 'svgs',
					dimentions: {
						x: 300,
						y: 300,
					},
				},
				{
					src: Filipino,
					alt: 'filipino',
					dimentions: {
						x: 300,
						y: 400,
					},
				},
			],
			color: 'bg-purple-200',
			examples: ['Games Night', 'Art Night', 'Club Night'],
		},
		{
			title: 'Convention Trips',
			description:
				'Experience the excitement of anime conventions with fellow fans! We organize group trips to major conventions, offering discounted tickets, and shared transportation. These trips are highlights of our year and provide unforgettable memories.',
			frequency: '2-3 times per year',
			image: ComicCon, // No need for explicit casting
			color: 'bg-green-200',
			examples: ['MCM ComiCon'],
		},
		// {
		//   title: "Guest Speakers & Panels",
		//   description:
		//     "Learn from industry professionals and experts! We invite guest speakers including voice actors, animators, directors, and cultural experts to share their knowledge and experiences. These events provide valuable insights into the anime industry and Japanese culture.",
		//   frequency: "Once per semester",
		//   image: "/placeholder.svg?height=400&width=300&text=Guest+Speakers",
		//   color: "bg-orange-200",
		//   examples: [
		//     "Voice Actor Q&A",
		//     "Animation Workshop",
		//     "Industry Panel",
		//     "Cultural Lecture",
		//   ],
		// },
	];

	return (
		<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
			<main className="flex-1">
				<SectionContainer>
					<div className="mb-4">
						<Button
							asChild
							variant="default"
							className="border-2 bg-button2 hover:bg-button1 border-black"
						>
							<Link href="/" className="flex items-center">
								<ChevronLeft className="mr-2 h-4 w-4" /> Back to
								Home
							</Link>
						</Button>
					</div>

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
								key={index}
								title={event.title}
								description={event.description}
								frequency={event.frequency}
								image={event.image}
								collageImage={event.collageImage}
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
