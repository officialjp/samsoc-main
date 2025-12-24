import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';

import DashboardTabArray from '~/app/_components/dashboard/dashboard-tab-array';
import DashButtons from '~/app/_components/dashboard/dashboard-link-buttons';
import AdminAnimeScheduler from '~/app/_components/dashboard/games/daily-anime';
import AdminStudioScheduler from '~/app/_components/dashboard/games/daily-studio';
import AdminBannerScheduler from '~/app/_components/dashboard/games/daily-banner';

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
					<DashButtons />
					<DashboardTabArray tabData={carouselPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
