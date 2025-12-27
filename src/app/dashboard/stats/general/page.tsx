import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import DashboardNavigationButtons from '../../_components/dashboard-navigation-buttons';

export default function GeneralStatsPage() {
	const iframes = [
		'https://eu.posthog.com/embedded/Hw1yym969eMabNJ0JxU5OQvQOT8yCQ',
		'https://eu.posthog.com/embedded/5vb8VBl_LLG495c03HeF1CZpMS34-w',
		'https://eu.posthog.com/embedded/HgoVJFKPpBtXLWgvh3dR4VVDNieSBA',
		'https://eu.posthog.com/embedded/MztD5lnnvB-rcM19tMSfl-w9kjGZlg',
	];

	return (
		<SectionContainer>
			<ScrollAnimationWrapper variant="fadeInUp">
				<SectionHeading
					badge="GENERAL STATS"
					title="General Overview"
					badgeColor="bg-green-200"
					description="Broad metrics covering website traffic, user engagement, and committee activity."
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
