import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import DashboardTabs from '../_components/dashboard-tabs';
import ImageAdd from './_components/library-add';
import ImageRemove from './_components/library-remove';
import { MangaItemEditor } from './_components/library-editor';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import { CACHE_TTL } from '~/server/api/helpers/cache';

const mangaPageObj = [
	{
		name: 'Create manga entry',
		page: <ImageAdd />,
		ttlSeconds: CACHE_TTL.MODERATE,
	},
	{
		name: 'Delete manga entry',
		page: <ImageRemove />,
		ttlSeconds: CACHE_TTL.MODERATE,
	},
	{
		name: 'Edit manga entry',
		page: <MangaItemEditor />,
		ttlSeconds: CACHE_TTL.MODERATE,
	},
];

export default function Page() {
	return (
		<SectionContainer>
			<SectionHeading
				badge="DASHBOARD"
				title="Library Page Dashboard"
				description="This is the dashboard for the library page of the website"
				badgeColor="bg-purple-200"
			/>
			<div className="flex flex-col items-center gap-8 mx-auto max-w-7xl py-12 px-4">
				<DashboardNavigationButtons />
				<div className="w-full">
					<DashboardTabs tabData={mangaPageObj} />
				</div>
			</div>
		</SectionContainer>
	);
}
