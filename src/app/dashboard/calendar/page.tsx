import Link from 'next/link';
import OpenEventAdd from '~/app/_components/dashboard/calendar/open-event-add';
import OpenRemovalButton from '~/app/_components/dashboard/calendar/open-event-removal';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';

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
					<OpenRemovalButton />
					<OpenEventAdd />
					<Link href={'/dashboard'}>
						<Button className="hover:cursor-pointer">Back</Button>
					</Link>
				</div>
			</SectionContainer>
		</div>
	);
}
