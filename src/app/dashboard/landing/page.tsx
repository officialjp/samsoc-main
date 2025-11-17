import OpenFormButton from '~/app/_components/dashboard/landing/open-carousel-form';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';

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
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<OpenFormButton />
					<Button className="hover:cursor-pointer bg-button2 hover:bg-button1">
						Change Anime-Cards Data
					</Button>
					<Button className="hover:cursor-pointer bg-button2 hover:bg-button1">
						Change Committee Display Data
					</Button>
				</div>
			</SectionContainer>
		</div>
	);
}
