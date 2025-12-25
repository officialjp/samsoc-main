import DashButtons from '../_components/dashboard-link-buttons';
import DashboardTabArray from '../_components/dashboard-tab-array';
import ImageAdd from './_components/image-add';
import ImageRemove from './_components/image-removal';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';

const galleryPageObj = [
	{
		name: 'Create calendar event',
		page: <ImageAdd />,
	},
	{
		name: 'Remove calendar event',
		page: <ImageRemove />,
	},
];

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Gallery Page Dashboard"
					description="This is the dashboard for the gallery page of the website"
					badgeColor="bg-purple-200"
				/>
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<DashButtons />
					<DashboardTabArray tabData={galleryPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
