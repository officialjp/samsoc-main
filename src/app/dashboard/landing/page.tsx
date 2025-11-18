import Link from 'next/link';
import OpenFormButton from '~/app/_components/dashboard/landing/open-carousel-form';
import OpenRemovalButton from '~/app/_components/dashboard/landing/open-carousel-removal';
import OpenCommitteeEditor from '~/app/_components/dashboard/landing/open-committee-editor';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';
import OpenAnimeCardEditor from '~/app/_components/dashboard/landing/open-animecard-editor';

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
					<OpenRemovalButton />
					<OpenCommitteeEditor />
					<OpenAnimeCardEditor />
					<Link href={'/dashboard'}>
						<Button className="hover:cursor-pointer">Back</Button>
					</Link>
				</div>
			</SectionContainer>
		</div>
	);
}
