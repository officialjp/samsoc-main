import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
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
		<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
			<main className="flex-1">
				<SectionContainer>
					<div className="mb-4">
						<Button
							asChild
							variant="default"
							className="border-2 bg-button2 hover:bg-button1 border-black"
						>
							<Link href="/" className="flex items-center">
								<ChevronLeft className="mr-2 h-4 w-4" /> Back to
								Home
							</Link>
						</Button>
					</div>

					<SectionHeading
						badge="MEMORIES"
						title="Photo Gallery"
						description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
						badgeColor="bg-purple-200"
						className="mb-12"
					/>

					<GalleryContent/>
				</SectionContainer>
			</main>
		</div>
	);
}
