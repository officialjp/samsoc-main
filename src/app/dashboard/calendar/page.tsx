import EventAdd from './_components/event-add';
import EventRemove from './_components/event-removal';
import DashboardNavigationButtons from '../_components/dashboard-navigation-buttons';
import DashboardTabs from '../_components/dashboard-tabs';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';

const calendarPageObj = [
	{
		name: 'Create calendar event',
		page: <EventAdd />,
	},
	{
		name: 'Remove calendar event',
		page: <EventRemove />,
	},
];

export default function Page() {
	return (
		<SectionContainer>
			<SectionHeading
				badge="DASHBOARD"
				title="Calendar Page Dashboard"
				description="This is the dashboard for the calendar page of the website"
				badgeColor="bg-purple-200"
			/>
			<div className="flex flex-col items-center gap-8 mx-auto max-w-7xl py-12 px-4">
				<DashboardNavigationButtons />
				<div className="w-full">
					<DashboardTabs tabData={calendarPageObj} />
				</div>
			</div>
		</SectionContainer>
	);
}
