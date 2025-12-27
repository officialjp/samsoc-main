import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { api } from '~/trpc/server';
import { LibrarySearch } from './_components/library-search';
import LibrarySkeleton from './_components/library-skeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Library',
	description:
		'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Library',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Surrey Anime and Manga Society - Library',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Surrey Anime and Manga Society - Library',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
		images: ['/opengraph-image'],
	},
	alternates: {
		canonical: '/library',
	},
	robots: {
		index: true,
		follow: true,
	},
};

interface MangaWithGenres {
	id: number;
	title: string;
	author: string;
	volume: number;
	borrowed_by: string | null;
	source: string;
	genres: Array<{ id: number; name: string }>;
}

interface MangaData {
	id: number;
	title: string;
	source: string;
	author: string;
	borrowed_by: string | null;
	volume: number;
	genres: string[];
}

const ALL_GENRES = [
	'Action',
	'Adventure',
	'Comedy',
	'Drama',
	'Fantasy',
	'Horror',
	'Mystery',
	'Romance',
	'Sci-Fi',
	'Slice of Life',
	'Sports',
	'Supernatural',
	'Thriller',
	'Psychological',
	'Historical',
	'School',
	'Seinen',
	'Shounen',
	'Shoujo',
] as const;

interface LibraryPageProps {
	searchParams: Promise<{
		page?: string;
		status?: string;
		genre?: string;
		search?: string;
	}>;
}

async function LibraryContent({
	searchParams,
}: {
	searchParams: {
		page?: string;
		status?: string;
		genre?: string;
		search?: string;
	};
}) {
	const page = Number(searchParams.page) || 1;
	const status =
		(searchParams.status as 'all' | 'available' | 'borrowed') || 'all';
	const genre = searchParams.genre ?? 'all';
	const search = searchParams.search ?? '';

	const ITEMS_PER_PAGE = 12;

	// Fetch paginated data from the server
	const mangaResponse = await api.manga.getLibraryPaginated({
		limit: ITEMS_PER_PAGE,
		page,
		status,
		genre: genre !== 'all' ? genre : undefined,
		search: search || undefined,
	});

	const rawMangaData = mangaResponse.items as MangaWithGenres[];

	const mangaData: MangaData[] = rawMangaData.map((manga) => ({
		id: manga.id,
		title: manga.title,
		author: manga.author,
		volume: manga.volume,
		borrowed_by: manga.borrowed_by,
		source: manga.source,
		genres: manga.genres.map((g) => g.name),
	}));

	const totalPages = mangaResponse.totalPages;

	return (
		<LibrarySearch
			initialMangaData={mangaData}
			allGenres={ALL_GENRES}
			currentPage={page}
			totalPages={totalPages}
			totalCount={mangaResponse.totalCount}
			initialFilters={{
				status,
				genre,
				search,
			}}
		/>
	);
}

export default async function LibraryPage(props: LibraryPageProps) {
	const searchParams = await props.searchParams;

	return (
		<main className="min-h-screen w-full">
			<SectionContainer>
				<SectionHeading
					badge="MANGA"
					title="Our Library"
					description="Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks."
					badgeColor="bg-purple-200"
					className="mb-8"
				/>
				<Suspense fallback={<LibrarySkeleton />}>
					<LibraryContent searchParams={searchParams} />
				</Suspense>
			</SectionContainer>
		</main>
	);
}
