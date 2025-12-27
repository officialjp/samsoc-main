import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import type { Metadata } from 'next';
import { api } from '~/trpc/server';
import { Calendar } from './_components/calendar';
import type { Event } from '@prisma/client';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import { Suspense } from 'react';
import CalendarSkeleton from './_components/calendar-skeleton';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Calendar',
	description:
		'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Calendar',
		description:
			'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Surrey Anime and Manga Society - Calendar',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Surrey Anime and Manga Society - Calendar',
		description:
			'Browse our upcoming events and regular anime screenings. Click on any event for more details!',
		images: ['/opengraph-image'],
	},
	alternates: {
		canonical: '/calendar',
	},
	robots: {
		index: true,
		follow: true,
	},
};

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

interface CalendarPageProps {
	searchParams: Promise<{
		year?: string;
		month?: string;
	}>;
}

async function CalendarContent({
	searchParams,
}: {
	searchParams: {
		year?: string;
		month?: string;
	};
}) {
	const now = new Date();
	const year = searchParams.year
		? Number(searchParams.year)
		: now.getFullYear();
	const month = searchParams.month
		? Number(searchParams.month)
		: now.getMonth();

	// Fetch events for the specific month
	const eventsResponse = await api.event.getEventsPaginated({
		year,
		month,
	});

	const events = eventsResponse.events as Event[];

	return <Calendar events={events} initialYear={year} initialMonth={month} />;
}

export default async function CalendarPage(props: CalendarPageProps) {
	const searchParams = await props.searchParams;

	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<ScrollAnimationWrapper variant="fadeInUp">
						<SectionHeading
							badge="SCHEDULE"
							title="Event Calendar"
							description="Browse our upcoming events and regular anime screenings. Click on any event for more details!"
							badgeColor="bg-purple-200"
							className="mb-12"
						/>
					</ScrollAnimationWrapper>
					<ScrollAnimationWrapper variant="fadeIn" delay={100}>
						<Suspense fallback={<CalendarSkeleton />}>
							<CalendarContent searchParams={searchParams} />
						</Suspense>
					</ScrollAnimationWrapper>
					<ScrollAnimationWrapper variant="fadeInUp" delay={200}>
						<EventColorGuide />
					</ScrollAnimationWrapper>
				</SectionContainer>
			</main>
		</div>
	);
}
