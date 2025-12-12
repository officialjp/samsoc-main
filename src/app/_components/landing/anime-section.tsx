import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { AnimeCard } from './anime-card'; // Your existing component
import { SectionHeading } from '../section-heading'; // Adjust imports as needed
import { Button } from '../ui/button';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

async function AnimeFetcher() {
	const cardResult = await api.post.getAnimeCardData();
	const cardData = cardResult.data ?? [];

	return <AnimeCard animes={cardData} />;
}

export function AnimeSection() {
	return (
		<div className="w-full">
			<SectionHeading
				badge="NOW STREAMING"
				title="This Week's Anime"
				description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly anime screenings!"
				badgeColor="bg-purple-200"
			/>
			<Suspense
				fallback={
					<div className="h-[400px] w-full animate-pulse bg-gray-100 rounded-xl" />
				}
			>
				<AnimeFetcher />
			</Suspense>

			<div className="mb-8 -mt-8 text-center">
				<p className="font-medium mb-4">
					Don&apos;t worry if you&apos;ve missed previous episodes -
					you have plenty of time to catch-up!
				</p>
				<Button
					asChild
					className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
				>
					<Link href="/calendar" className="flex items-center">
						<CalendarDays className="mr-2 h-4 w-4" />
						View Full Calendar
					</Link>
				</Button>
			</div>
		</div>
	);
}
