import { HeroSection } from '@/components/landing/hero-section';
import { NowStreamingContent } from '@/components/landing/now-streaming';
import { MembershipSection } from '@/components/landing/membership-section';
import { LibrarySection } from '@/components/landing/library-section';
import { AboutSection } from '@/components/landing/about-section';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';

export default async function AnimeSocietyLanding() {
	return (
		<div className="flex min-h-screen flex-col w-full">
			<main className="flex-1">
				<HeroSection />

				<AboutSection />

				<SectionContainer
					id="now-streaming"
					className="w-full py-12 md:py-16 overflow-hidden"
				>
					<SectionHeading
						badge="NOW STREAMING"
						title="This Week's Anime"
						description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly
              anime screenings!"
						badgeColor="bg-purple-200"
					/>
					<NowStreamingContent />
				</SectionContainer>

				<LibrarySection />

				<MembershipSection />
			</main>
		</div>
	);
}
