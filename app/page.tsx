import { HeroSection } from '@/components/landing/hero-section';
import { NowStreamingContent } from '@/components/landing/now-streaming';
import { MembershipSection } from '@/components/landing/membership-section';
import { LibrarySection } from '@/components/landing/library-section';
import { AboutSection } from '@/components/landing/about-section';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { CalendarDays, ListIcon, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default async function AnimeSocietyLanding() {
	return (
		<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
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
					<div className="mt-8 text-center">
						<p className="font-medium mb-4">
							Don't worry if you've missed previous episodes - you
							have plenty of time to catch-up!
						</p>
						<Button
							asChild
							className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
						>
							<Link
								href="/calendar"
								className="flex items-center"
							>
								<CalendarDays className="mr-2 h-4 w-4" />
								View Full Calendar
							</Link>
						</Button>
					</div>
				</SectionContainer>

				<LibrarySection />

				<MembershipSection />
			</main>
		</div>
	);
}
