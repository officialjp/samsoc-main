import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import type { Metadata } from 'next';
import { api, HydrateClient } from '~/trpc/server';
import { GallerySearch } from '../_components/gallery/gallery-search';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Gallery',
	description:
		'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Gallery',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society - Gallery',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	},
};

export default async function GalleryPage({
	searchParams,
}: {
	searchParams: Promise<{ page?: string }>;
}) {
	const params = await searchParams;
	const page = parseInt(params.page ?? '1', 10);
	const pageSize = 15;

	const imageResponse = await api.post.getImageData({
		page,
		pageSize,
	});

	const imageData = imageResponse?.data ?? [];
	const totalImages = imageResponse?.total ?? 0;
	const totalPages = Math.ceil(totalImages / pageSize);

	return (
		<HydrateClient>
			<main className="min-h-screen w-full">
				<SectionContainer>
					<SectionHeading
						badge="MEMORIES"
						title="Photo Gallery"
						description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
						badgeColor="bg-purple-200"
						className="mb-12"
					/>
					<GallerySearch
						initialItems={imageData}
						currentPage={page}
						totalPages={totalPages}
						totalImages={totalImages}
					/>
				</SectionContainer>
			</main>
		</HydrateClient>
	);
}
