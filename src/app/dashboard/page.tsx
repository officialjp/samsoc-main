import Link from 'next/link';
import { Button } from '../_components/ui/button';
import { SectionContainer } from '../_components/section-container';
import { SectionHeading } from '../_components/section-heading';
import DashButtons from '../_components/dashboard/dashboard-link-buttons';

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Committee Dashboard"
					badgeColor="bg-purple-200"
					description="Here is a collection of dashboards you can use to change the data displayed on the website!"
				/>
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<DashButtons></DashButtons>
					<p className="font-bold italic">
						Ahem... Do not and I REPEAT do not, go to the admin
						panel if you don&apos;t know what you&apos;re doing
					</p>
					<Link href={'/admin/users'}>
						<Button className="hover:cursor-pointer bg-red-500 hover:bg-red-600">
							Admin Panel
						</Button>
					</Link>
				</div>
			</SectionContainer>
		</div>
	);
}
