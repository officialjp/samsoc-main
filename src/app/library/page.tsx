import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { api, HydrateClient } from '~/trpc/server';
import { LibrarySearch } from '~/app/_components/library/library-search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Library',
	description:
		'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Library',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society - Library',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	},
};

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
	const mangaResponse = await api.post.getMangaData();
	const rawMangaData = mangaResponse?.data || [];

	// Transform data on server
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
		<HydrateClient>
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
		</HydrateClient>
	);
}
