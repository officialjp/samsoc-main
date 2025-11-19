import EventAdd from '~/app/_components/dashboard/calendar/event-add';
import EventRemove from '~/app/_components/dashboard/calendar/event-removal';
import DashButtons from '~/app/_components/dashboard/dashboard-link-buttons';
import DashboardTabArray from '~/app/_components/dashboard/dashboard-tab-array';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';

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
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Calendar Page Dashboard"
					description="This is the dashboard for the calendar page of the website"
					badgeColor="bg-purple-200"
				/>
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<DashButtons />
					<DashboardTabArray tabData={calendarPageObj} />
				</div>
			</SectionContainer>
		</div>
	);
}
