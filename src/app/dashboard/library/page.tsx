import DashButtons from '~/app/_components/dashboard/dashboard-link-buttons';
import DashboardTabArray from '~/app/_components/dashboard/dashboard-tab-array';
import ImageAdd from '~/app/_components/dashboard/library/library-add';
import ImageRemove from '~/app/_components/dashboard/library/library-remove';
import { MangaItemEditor } from '~/app/_components/dashboard/library/library-editor';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';

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
					<DashButtons />
					<DashboardTabArray tabData={mangaPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
