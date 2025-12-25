import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import type { Metadata } from 'next';
import { api } from '~/trpc/server';
import { GallerySearch } from './_components/gallery-search';

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

export default async function GalleryPage() {
	const imageResponse = await api.image.getGalleryData();
	const imageData = imageResponse?.data ?? [];

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
				<GallerySearch initialItems={imageData} />
			</SectionContainer>
		</main>
	);
}
