import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import CarouselForm from '~/app/_components/dashboard/landing/carousel-add';
import CarouselRemove from '~/app/_components/dashboard/landing/carousel-removal';
import { CommitteeMemberEditor } from '~/app/_components/dashboard/landing/committee-editor';
import { AnimeCardEditor } from '~/app/_components/dashboard/landing/animecard-editor';

import DashboardTabArray from '~/app/_components/dashboard/dashboard-tab-array';
import DashButtons from '~/app/_components/dashboard/dashboard-link-buttons';

const carouselPageObj = [
	{
		name: 'Create carousel page',
		page: <CarouselForm />,
	},
	{
		name: 'Remove carousel page',
		page: <CarouselRemove />,
	},
	{
		name: 'Edit committee members',
		page: <CommitteeMemberEditor />,
	},
	{
		name: 'Edit anime cards',
		page: <AnimeCardEditor />,
	},
];

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Landing Page Dashboard"
					description="This is the dashboard for the landing page of the website"
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
