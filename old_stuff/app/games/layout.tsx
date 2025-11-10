import GalleryContent from '@/components/gallery/gallery-content';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
	description: 'Website for the anime society in the University of Surrey',
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			'Website for the anime society in the University of Surrey',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			'Website for the anime society in the University of Surrey',
	},
};

export default function GamesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <section className="">{children}</section>;
}
