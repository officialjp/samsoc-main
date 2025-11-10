import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { BookOpen } from 'lucide-react';
import { api } from '~/trpc/server';
import { LibrarySearch } from '~/app/_components/library/library-search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
	description:
		'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks.',
	},
};

interface Manga {
	id: number;
	title: string;
	source: string;
	author: string;
	borrowed_by: string | null;
	volume: number;
	genres: { name: string }[];
}

interface FormattedMangaData {
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
];

export default async function LibraryPage() {
	const mangaResponse = await api.post.getMangaData();
	const mangaData: Manga[] = mangaResponse?.data || [];

	const initialMangaData: FormattedMangaData[] = mangaData.map((manga) => ({
		id: manga.id,
		title: manga.title,
		author: manga.author,
		volume: manga.volume,
		borrowed_by: manga.borrowed_by,
		source: manga.source,
		genres: manga.genres.map((g) => g.name),
	}));

	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="MANGA"
						title="Our Library"
						description="Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks."
						badgeColor="bg-purple-200"
						className="mb-8"
					/>
					<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
						<div className="grid">
							<div>
								<LibrarySearch
									initialMangaData={initialMangaData}
									allGenres={ALL_GENRES}
								/>
							</div>

							<div className="mt-6 bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								<h3 className="text-lg font-bold mb-2 flex items-center">
									<BookOpen className="h-5 w-5 mr-2" />{' '}
									Library Rules
								</h3>
								<ul className="text-sm space-y-2">
									<li>• Paid members only</li>
									<li>
										• Only one manga borrowed per person at
										a time
									</li>
									<li>• Academic year borrowing period</li>
									<li>• No late fees</li>
								</ul>
							</div>
						</div>
					</div>
				</SectionContainer>
			</main>
		</div>
	);
}
