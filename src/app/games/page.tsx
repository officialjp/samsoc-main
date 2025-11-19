import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { HydrateClient } from '~/trpc/server';
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

export default async function Page() {
	return (
		<HydrateClient>
			<main>
				<SectionContainer>
					<SectionHeading
						badge="GAMES"
						title="Here are all the online games you can play to win prizes!"
					></SectionHeading>
				</SectionContainer>
			</main>
		</HydrateClient>
	);
}
