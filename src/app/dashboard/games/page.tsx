import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { CACHE_TTL } from '~/server/api/helpers/cache';

import DashboardTabs from '../_components/dashboard-tabs';
import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import AdminAnimeScheduler from './_components/daily-anime';
import AdminStudioScheduler from './_components/daily-studio';
import AdminBannerScheduler from './_components/daily-banner';

const gamesPageObj = [
	{
		name: 'Change Daily Anime',
		page: <AdminAnimeScheduler />,
		ttlSeconds: CACHE_TTL.DAILY,
	},
	{
		name: 'Change Daily Studio',
		page: <AdminStudioScheduler />,
		ttlSeconds: CACHE_TTL.DAILY,
	},
	{
		name: 'Change Daily Banner',
		page: <AdminBannerScheduler />,
		ttlSeconds: CACHE_TTL.DAILY,
	},
];

export default function Page() {
	return (
		<SectionContainer>
			<SectionHeading
				badge="DASHBOARD"
				title="Games Page Dashboard"
				description="This is the dashboard for the games page of the website"
				badgeColor="bg-purple-200"
			/>
			<div className="flex flex-col items-center gap-8 mx-auto max-w-7xl py-12 px-4">
				<DashboardNavigationButtons />
				<div className="w-full">
					<DashboardTabs tabData={gamesPageObj} />
				</div>
			</div>
		</SectionContainer>
	);
}
