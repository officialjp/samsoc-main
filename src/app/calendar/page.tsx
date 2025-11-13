import { SectionContainer } from '../_components/section-container';
import { SectionHeading } from '../_components/section-heading';
import type { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { Calendar } from '../_components/calendar/calendar';
import type { Event } from 'generated/prisma';

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

// Color legend component extracted to avoid re-renders
function EventColorGuide() {
	const legendItems = [
		{ color: 'bg-purple-200', label: 'Weekly Anime Screenings' },
		{ color: 'bg-pink-200', label: 'Socials' },
		{ color: 'bg-cyan-200', label: 'Trips' },
		{ color: 'bg-yellow-200', label: 'Special Screenings' },
		{ color: 'bg-green-200', label: 'Other' },
	] as const;

	return (
		<div className="mt-12 bg-white border-2 rounded-2xl border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<h3 className="text-xl font-bold mb-4">Event Color Guide</h3>
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				{legendItems.map(({ color, label }) => (
					<div key={label} className="flex items-center">
						<div
							className={`w-4 h-4 ${color} border border-black mr-2`}
						></div>
						<span>{label}</span>
					</div>
				))}
			</div>
		</div>
	);
}

// Optimized: Move heavy computation to server-side
function generateWeeklySessions(regularSessions: Event[]): Event[] {
	const sessions: Event[] = [];

	for (const session of regularSessions) {
		const sessionCount = session.session_count ?? 0;
		if (sessionCount === 0) continue;

		let currentDate = new Date(session.date);

		sessions.push({
			id: session.id,
			title: 'Voting Session',
			description:
				'Sit down with us and vote on which 3 animes we will be watching this semester!',
			location: session.location,
			date: new Date(currentDate),
			color: 'bg-purple-200',
			is_regular_session: true,
			session_count: null,
		});

		for (let i = 1; i < sessionCount; i++) {
			currentDate = new Date(
				currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
			);
			sessions.push({
				id: session.id,
				title: session.title,
				description: session.description,
				location: session.location,
				date: new Date(currentDate),
				color: 'bg-purple-200',
				is_regular_session: true,
				session_count: null,
			});
		}
	}

	return sessions;
}

export default async function CalendarPage() {
	const [eventResponse, sessionResponse] = await Promise.all([
		api.post.getSpecialEvents(),
		api.post.getRegularSessions(),
	]);

	const eventData = eventResponse.data ?? [];
	const regularSessions = sessionResponse.data ?? [];

	const weeklySessions = generateWeeklySessions(regularSessions);
	const allEvents = [...eventData, ...weeklySessions] as Event[];

	return (
		<HydrateClient>
			<div className="flex min-h-screen flex-col w-full">
				<main className="flex-1">
					<SectionContainer>
						<SectionHeading
							badge="SCHEDULE"
							title="Event Calendar"
							description="Browse our upcoming events and regular anime screenings. Click on any event for more details!"
							badgeColor="bg-purple-200"
							className="mb-12"
						/>
						<div>
							<Calendar events={allEvents} />
							<EventColorGuide />
						</div>
					</SectionContainer>
				</main>
			</div>
		</HydrateClient>
	);
}
