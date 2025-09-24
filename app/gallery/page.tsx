import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { Metadata } from 'next';
import GalleryContent from '@/components/gallery/gallery-content';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
	description:
		'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			'Browse through our collection of photos from events, weekly sessions, and collaborations over the years.',
	},
};

export default function GalleryPage() {
	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="MEMORIES"
						title="Photo Gallery"
						description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
						badgeColor="bg-purple-200"
						className="mb-12"
					/>

					<GalleryContent />
				</SectionContainer>
			</main>
		</div>
	);
}
