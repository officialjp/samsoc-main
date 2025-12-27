import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import DashboardNavigationButtons from '../../_components/dashboard-navigation-buttons';

export default function AnimeStatsPage() {
	const iframes = [
		'https://eu.posthog.com/embedded/nIDKqdj9oVvOYuN2fnX0kTqgfi9njg',
		'https://eu.posthog.com/embedded/425jlzKV_CH0JmzppYeQrRr5kR2ycQ',
		'https://eu.posthog.com/embedded/rhLP4AF8-Kcy2PIMlCvYnzgu3U3t2g',
		'https://eu.posthog.com/embedded/oPVBb41gXLK_6ftZRvSTvySdDW1_Lw',
		'https://eu.posthog.com/embedded/R5OTgkDVUeBN2r70ZD-hJr-QJVXXrg',
		'https://eu.posthog.com/embedded/KBfOJmj6aLn2xVLf7C31NCK_3AFmxQ',
		'https://eu.posthog.com/embedded/nIDKqdj9oVvOYuN2fnX0kTqgfi9njg',
	];

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

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
						{iframes.map((url, index) => (
							<div
								key={index}
								className="w-full h-[450px] rounded-xl border border-border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
							>
								<iframe
									src={url}
									width="100%"
									height="100%"
									allowFullScreen
								/>
							</div>
						))}
					</div>
				</div>
			</ScrollAnimationWrapper>
		</SectionContainer>
	);
}
