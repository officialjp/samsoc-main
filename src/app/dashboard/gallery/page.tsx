import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import DashboardTabs from '../_components/dashboard-tabs';
import ImageAdd from './_components/image-add';
import ImageRemove from './_components/image-removal';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { CACHE_TTL } from '~/server/api/helpers/cache';

const galleryPageObj = [
	{
		name: 'Add gallery images',
		page: <ImageAdd />,
		ttlSeconds: CACHE_TTL.MODERATE,
	},
	{
		name: 'Remove gallery images',
		page: <ImageRemove />,
		ttlSeconds: CACHE_TTL.MODERATE,
	},
];

export default function Page() {
	return (
		<SectionContainer>
			<SectionHeading
				badge="DASHBOARD"
				title="Gallery Page Dashboard"
				description="This is the dashboard for the gallery page of the website"
				badgeColor="bg-purple-200"
			/>
			<div className="flex flex-col items-center gap-8 mx-auto max-w-7xl py-12 px-4">
				<DashboardNavigationButtons />
				<div className="w-full">
					<DashboardTabs tabData={galleryPageObj} />
				</div>
			</div>
		</SectionContainer>
	);
}
