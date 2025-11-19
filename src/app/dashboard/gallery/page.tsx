import Link from 'next/link';
import DashButtons from '~/app/_components/dashboard/dashboard-link-buttons';
import DashboardTabArray from '~/app/_components/dashboard/dashboard-tab-array';
import ImageAdd from '~/app/_components/dashboard/gallery/image-add';
import ImageRemove from '~/app/_components/dashboard/gallery/image-removal';
import OpenImageAdd from '~/app/_components/dashboard/gallery/open-gallery-add';
import OpenImageRemove from '~/app/_components/dashboard/gallery/open-gallery-removal';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';

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
