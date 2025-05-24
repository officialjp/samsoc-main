'use client';

const levenshtein = require('js-levenshtein');
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Miku from '@/public/miku.png';
import { useEffect, useState } from 'react';
import { SectionContainer } from '@/components/section-container';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/section-heading';
import { ChevronRight } from 'lucide-react';

export default function NotFound() {
	const [links, setLinks] = useState<any | undefined>();

	const pathName = usePathname()
		.toLowerCase()
		.replaceAll('%20', ' ')
		.replaceAll('_', ' ')
		.replaceAll('-', ' ')
		.split('/')[usePathname().split('/').length - 1];

	const pageIndex = {
		library: {
			route: '/library',
			icon: '📚',
		},
		events: {
			route: '/events',
			icon: '🥳',
		},
		calendar: {
			route: '/calendar',
			icon: '🗓️',
		},
		gallery: {
			route: '/gallery',
			icon: '🖼️',
		},
		'hall of fame': {
			route: '/hof',
			icon: '🏆',
		},
		hof: {
			route: '/hof',
			icon: '🏆',
		},
	};

	useEffect(() => {
		setLinks(
			Object.entries(pageIndex)
				.filter(
					([name, data]) =>
						levenshtein(name, pathName) < 3 ||
						name.includes(pathName),
				)
				.map(([name, data], index) => {
					return (
						<Button
							key={name + index}
							asChild
							className="bg-thebutton text-white text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-7 px-4 sm:px-6 md:px-8 border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-fit mb-3"
						>
							<Link href={data.route}>
								<span className="mr-2">{data.icon}</span>
								{name
									.split(' ')
									.map((word) => {
										return (
											word.slice(0, 1).toUpperCase() +
											word.slice(1)
										);
									})
									.join(' ')}
								<ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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
						<Image
							src={Miku.src}
							width={200}
							height={200}
							alt={'404 image'}
							draggable={false}
							className="mx-auto"
						/>
						<SectionHeading
							badge="uh oh..."
							title="404: Page Not Found"
							description="The page you were looking for doesnt exist"
							badgeColor="bg-purple-200"
						/>
						<div className="mt-8 text-center flex flex-col items-center">
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
					<Image
						src={Miku.src}
						width={200}
						height={200}
						alt={'404 image'}
						className="mx-auto"
					/>
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
