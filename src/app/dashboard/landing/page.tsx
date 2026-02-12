import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import CarouselForm from './_components/carousel-add';
import CarouselRemove from './_components/carousel-removal';
import { CommitteeMemberEditor } from './_components/committee-editor';
import { AnimeCardEditor } from './_components/anime-card-editor';
import { CACHE_TTL } from '~/server/api/helpers/cache';

import DashboardTabs from '../_components/dashboard-tabs';
import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';

const carouselPageObj = [
	{
		name: 'Create carousel page',
		page: <CarouselForm />,
		ttlSeconds: CACHE_TTL.CAROUSEL,
	},
	{
		name: 'Remove carousel page',
		page: <CarouselRemove />,
		ttlSeconds: CACHE_TTL.CAROUSEL,
	},
	{
		name: 'Edit committee members',
		page: <CommitteeMemberEditor />,
		ttlSeconds: CACHE_TTL.STATIC,
	},
	{
		name: 'Edit anime cards',
		page: <AnimeCardEditor />,
	},
];

export default function Page() {
	return (
		<SectionContainer>
			<SectionHeading
				badge="DASHBOARD"
				title="Landing Page Dashboard"
				description="This is the dashboard for the landing page of the website"
				badgeColor="bg-purple-200"
			/>
			<div className="flex flex-col items-center gap-8 mx-auto max-w-7xl py-12 px-4">
				<DashboardNavigationButtons />
				<div className="w-full">
					<DashboardTabs tabData={carouselPageObj} />
				</div>
			</div>
		</SectionContainer>
	);
}
