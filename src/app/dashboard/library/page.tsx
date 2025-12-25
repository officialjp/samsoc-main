import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import DashboardTabs from '../_components/dashboard-tabs';
import ImageAdd from './_components/library-add';
import ImageRemove from './_components/library-remove';
import { MangaItemEditor } from './_components/library-editor';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';

const mangaPageObj = [
	{
		name: 'Create manga entry',
		page: <ImageAdd />,
	},
	{
		name: 'Delete manga entry',
		page: <ImageRemove />,
	},
	{
		name: 'Edit manga entry',
		page: <MangaItemEditor />,
	},
];

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Library Page Dashboard"
					description="This is the dashboard for the library page of the website"
					badgeColor="bg-purple-200"
				/>
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<DashboardNavigationButtons />
					<DashboardTabs tabData={mangaPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
