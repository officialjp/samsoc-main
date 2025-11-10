import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<SectionContainer>
					<SectionHeading
						badge="GAMES"
						title="Photo Gallery"
						description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
						badgeColor="bg-purple-200"
						className="mb-12"
					/>
				</SectionContainer>
			</main>
		</div>
	);
}
