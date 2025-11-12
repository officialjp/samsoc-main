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

export default async function GalleryPage() {
	const imageResponse = await api.post.getImageData();
	const imageData = imageResponse?.data || [];

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
					<GallerySearch initialItems={imageData} />
				</SectionContainer>
			</main>
		</HydrateClient>
	);
}
