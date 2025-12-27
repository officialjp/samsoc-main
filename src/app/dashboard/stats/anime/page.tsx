import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import DashboardNavigationButtons from '../../_components/dashboard-navigation-buttons';

export default function AnimeStatsPage() {
	return (
		<SectionContainer>
			<ScrollAnimationWrapper variant="fadeInUp">
				<SectionHeading
					badge="ANIME STATS"
					title="Anime Game Analytics"
					badgeColor="bg-blue-200"
					description="Detailed insights and player statistics for all registered anime games."
				/>
			</ScrollAnimationWrapper>
			<ScrollAnimationWrapper variant="fadeIn" delay={100}>
				<div className="flex flex-col items-center gap-8 py-12">
					<DashboardNavigationButtons />
					<div className="w-full max-w-7xl rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
						<iframe
							width="100%"
							height="2100"
							allowFullScreen
							src="https://eu.posthog.com/embedded/y7BtdIhcFX9XjWbEGztUc7YStYUL8Q"
						/>
					</div>
				</div>
			</ScrollAnimationWrapper>
		</SectionContainer>
	);
}
