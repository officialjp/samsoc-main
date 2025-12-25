import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';

import DashboardTabs from '../_components/dashboard-tabs';
import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import AdminAnimeScheduler from './_components/daily-anime';
import AdminStudioScheduler from './_components/daily-studio';
import AdminBannerScheduler from './_components/daily-banner';

const carouselPageObj = [
	{
		name: 'Change Daily Anime',
		page: <AdminAnimeScheduler />,
	},
	{
		name: 'Change Daily Studio',
		page: <AdminStudioScheduler />,
	},
	{
		name: 'Change Daily Banner',
		page: <AdminBannerScheduler />,
	},
];

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Games Page Dashboard"
					description="This is the dashboard for the games page of the website"
					badgeColor="bg-purple-200"
				/>
				<div className="flex items-center justify-center flex-col mx-auto max-w-7xl">
					<DashboardNavigationButtons />
					<DashboardTabs tabData={carouselPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
