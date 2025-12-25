import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { api } from '~/trpc/server';
import { LibrarySearch } from './_components/library-search';
import type { Metadata } from 'next';

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

export default async function LibraryPage() {
	const mangaResponse = await api.manga.getLibraryData();
	const rawMangaData = (mangaResponse?.data ?? []) as MangaWithGenres[];

	const mangaData: MangaData[] = rawMangaData.map((manga) => ({
		id: manga.id,
		title: manga.title,
		author: manga.author,
		volume: manga.volume,
		borrowed_by: manga.borrowed_by,
		source: manga.source,
		genres: manga.genres.map((g) => g.name),
	}));

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
				<LibrarySearch
					initialMangaData={mangaData}
					allGenres={ALL_GENRES}
				/>
			</SectionContainer>
		</main>
	);
}
