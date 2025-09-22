import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import LibraryContent from '@/components/library/library-client';
import { Metadata } from 'next';

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

export default function LibraryPage() {
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

					<LibraryContent />
				</SectionContainer>
			</main>
		</div>
	);
}
