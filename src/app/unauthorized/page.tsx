import { SectionContainer } from '~/components/layout/section-container';
import Image from 'next/image';
import { SectionHeading } from '~/components/layout/section-heading';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Page() {
	return (
		<div className="flex min-h-screen flex-col w-full">
			<SectionContainer
				id="404"
				className="w-full py-12 md:py-16 overflow-hidden"
			>
				<Image
					src={'/aqua.webp'}
					width={200}
					height={200}
					alt={'404 image'}
					className="mx-auto mb-4"
				/>
				<SectionHeading
					badge="uh oh..."
					title="405 Not Allowed"
					description="You do not possess the auth perms to access this page!"
					badgeColor="bg-purple-200"
				/>
				<div className="mt-8 text-center flex flex-col items-center">
					<Button
						asChild
						className="hover:cursor-pointer bg-button2 hover:bg-button1"
					>
						<Link href="/" className="mb-2">
							<span className="mr-2">🏠</span>
							Home
							<ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
						</Link>
					</Button>
				</div>
			</SectionContainer>
		</div>
	);
}
