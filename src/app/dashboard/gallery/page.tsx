import Link from 'next/link';
import OpenImageAdd from '~/app/_components/dashboard/gallery/open-gallery-add';
import OpenImageRemove from '~/app/_components/dashboard/gallery/open-gallery-removal';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';

export default function Page() {
	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="DASHBOARD"
					title="Gallery Page Dashboard"
					description="This is the dashboard for the gallery page of the website"
					badgeColor="bg-purple-200"
				/>
				<div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col gap-6">
					<OpenImageRemove />
					<OpenImageAdd />
					<Link href={'/dashboard'}>
						<Button className="hover:cursor-pointer">Back</Button>
					</Link>
				</div>
			</SectionContainer>
		</div>
	);
}
