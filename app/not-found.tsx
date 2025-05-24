'use client';

import { SvgIcon } from '@/components/ui/svgIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ExternalLink from '@/public/external-link.svg';
import { useEffect, useState } from 'react';
import { SectionContainer } from '@/components/section-container';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/section-heading';

export default function NotFound() {
	const [links, setLinks] = useState<any | undefined>(<></>);

	const pathName = usePathname()
		.toLowerCase()
		.replaceAll('%20', ' ')
		.replaceAll('_', ' ')
		.replaceAll('-', ' ')
		.split('/')[usePathname().split('/').length - 1];

	const pageIndex = {
		library: '/library',
		events: '/events',
		calendar: '/calendar',
		gallery: '/gallery',
		'hall of fame': '/hof',
		hof: '/hof',
	};

	useEffect(() => {
		setLinks(
			Object.entries(pageIndex)
				.filter(([name, route]) => name.includes(pathName))
				.map(([name, route], index) => {
					return (
						<Button
							asChild
							className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
							key={name + index}
						>
							<Link href={route}>
								<SvgIcon
									className="bg-[#000]"
									height={15}
									width={15}
									src={ExternalLink.src}
								></SvgIcon>
								{name}
							</Link>
						</Button>
					);
				}),
		);
	}, []);

	if (links && links.length > 0) {
		return (
			<>
				<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
					<SectionContainer
						id="404"
						className="w-full py-12 md:py-16 overflow-hidden"
					>
						<SectionHeading
							badge="uh oh..."
							title="404: Page Not Found"
							description="The page you were looking for doesnt exist"
							badgeColor="bg-purple-200"
						/>
						<div className="mt-8 text-center">
							<h1 className="mb-4">Did you mean:</h1>
							{links}
						</div>
					</SectionContainer>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
				<SectionContainer
					id="404"
					className="w-full py-12 md:py-16 overflow-hidden"
				>
					<SectionHeading
						badge="uh oh..."
						title="404 Page Not Found"
						description="The page you were looking for doesnt exist"
						badgeColor="bg-purple-200"
					/>
				</SectionContainer>
			</div>
		</>
	);
}
