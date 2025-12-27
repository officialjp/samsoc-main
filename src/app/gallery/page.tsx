import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import type { Metadata } from 'next';
import { api } from '~/trpc/server';
import { GallerySearch } from './_components/gallery-search';
import { Suspense } from 'react';
import GallerySkeleton from './_components/gallery-skeleton';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Gallery',
	description:
		'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Gallery',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Surrey Anime and Manga Society - Gallery',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Surrey Anime and Manga Society - Gallery',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
		images: ['/opengraph-image'],
	},
	alternates: {
		canonical: '/gallery',
	},
	robots: {
		index: true,
		follow: true,
	},
};

interface GalleryImageData {
	id: number;
	source: string;
	thumbnailSource: string | null;
	alt: string;
	category: string;
	year: number;
}

interface GalleryPageProps {
	searchParams: Promise<{
		page?: string;
		category?: string;
		year?: string;
	}>;
}

const CATEGORIES = ['All', 'Events', 'Collaborations'] as const;
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2022;

const YEARS = [
	'All',
	...Array.from({ length: CURRENT_YEAR - START_YEAR + 1 }, (_, i) =>
		String(START_YEAR + i),
	),
];

async function GalleryContent({
	searchParams,
}: {
	searchParams: {
		page?: string;
		category?: string;
		year?: string;
	};
}) {
	const page = Number(searchParams.page) || 1;
	const category = searchParams.category ?? 'All';
	const year = searchParams.year ?? 'All';

	const ITEMS_PER_PAGE = 15;

	// Fetch paginated data from the server
	const galleryResponse = await api.image.getGalleryPaginated({
		limit: ITEMS_PER_PAGE,
		page,
		category: category !== 'All' ? category : undefined,
		year: year !== 'All' ? parseInt(year) : undefined,
	});

	const imageData: GalleryImageData[] = galleryResponse.items;
	const totalPages = galleryResponse.totalPages;

	return (
		<GallerySearch
			initialItems={imageData}
			categories={CATEGORIES}
			years={YEARS}
			currentPage={page}
			totalPages={totalPages}
			totalCount={galleryResponse.totalCount}
			initialFilters={{
				category,
				year,
			}}
		/>
	);
}

export default async function GalleryPage(props: GalleryPageProps) {
	const searchParams = await props.searchParams;

	return (
		<main className="min-h-screen w-full">
			<SectionContainer>
				<SectionHeading
					badge="MEMORIES"
					title="Photo Gallery"
					description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
					badgeColor="bg-purple-200"
					className="mb-12"
				/>
				<Suspense fallback={<GallerySkeleton />}>
					<GalleryContent searchParams={searchParams} />
				</Suspense>
			</SectionContainer>
		</main>
	);
}
