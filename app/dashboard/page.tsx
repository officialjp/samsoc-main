import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import { auth } from '../../auth';

export default async function DashboardPage() {
	const session = await auth();
	if (!session?.user)
		return (
			<div>
				<SectionContainer>
					<SectionHeading
						badge="NO ACCESS"
						title="Committee Only"
						description="Hey, it seems like you are trying to access a committee only page!"
						badgeColor="bg-red-200"
						className="mb-8"
					></SectionHeading>
				</SectionContainer>
			</div>
		);
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Committee Dashboard"
					description="A page dedicated to changing the website content for the committee!"
					badgeColor="bg-purple-200"
					className="mb-8"
				></SectionHeading>
			</SectionContainer>
		</div>
	);
}
