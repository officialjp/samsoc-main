import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import CarouselForm from './_components/carousel-add';
import CarouselRemove from './_components/carousel-removal';
import { CommitteeMemberEditor } from './_components/committee-editor';
import { AnimeCardEditor } from './_components/anime-card-editor';

import DashboardTabs from '../_components/dashboard-tabs';
import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';

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
					<DashboardNavigationButtons />
					<DashboardTabs tabData={carouselPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
