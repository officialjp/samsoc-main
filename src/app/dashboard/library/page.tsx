import Link from 'next/link';
import OpenMangaAdd from '~/app/_components/dashboard/library/open-library-add';
import OpenMangaEditor from '~/app/_components/dashboard/library/open-library-editor';
import OpenMangaRemove from '~/app/_components/dashboard/library/open-library-remove';
import { SectionContainer } from '~/app/_components/section-container';
import { SectionHeading } from '~/app/_components/section-heading';
import { Button } from '~/app/_components/ui/button';

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
					<OpenMangaAdd />
					<OpenMangaRemove />
					<OpenMangaEditor />
					<Link href={'/dashboard'}>
						<Button className="hover:cursor-pointer">Back</Button>
					</Link>
				</div>
			</SectionContainer>
		</div>
	);
}
