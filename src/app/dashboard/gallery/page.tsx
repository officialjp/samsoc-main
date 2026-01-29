import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import DashboardTabs from '../_components/dashboard-tabs';
import ImageAdd from './_components/image-add';
import ImageRemove from './_components/image-removal';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';

const galleryPageObj = [
	{
		name: 'Add gallery images',
		page: <ImageAdd />,
	},
	{
		name: 'Remove gallery images',
		page: <ImageRemove />,
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
