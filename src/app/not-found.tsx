'use client';

import levenshtein from 'js-levenshtein';
import Link from 'next/link';
import Image from 'next/image';
import Miku from '../../public/miku.avif';
import { useEffect, useState, useMemo } from 'react';
import { SectionContainer } from '~/app/_components/section-container';
import { Button } from '~/app/_components/ui/button';
import { SectionHeading } from '~/app/_components/section-heading';
import { ChevronRight } from 'lucide-react';

type PageData = {
	route: string;
	icon: string;
};

const pageIndex: Record<string, PageData> = {
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
	games: {
		route: '/games',
		icon: '🎮',
	},
};

function getThreshold(name: string): number {
	return Math.max(1, Math.floor(name.length / 4));
}

export default function NotFound() {
	const [pathName, setPathName] = useState<string | null>(null);

	useEffect(() => {
		const fullPath = window.location.pathname;

		const normalizedPath = fullPath
			.toLowerCase()
			.replaceAll('%20', ' ')
			.replaceAll('_', ' ')
			.replaceAll('-', ' ')
			.split('/')
			.pop();

		setPathName(normalizedPath ?? null);
	}, []);

	const links = useMemo(() => {
		if (!pathName) {
			return null;
		}

		return Object.entries(pageIndex)
			.filter(([name]) => {
				const threshold = getThreshold(name);

				return (
					levenshtein(name, pathName) < threshold ||
					name.includes(pathName)
				);
			})
			.map(([name, data], index) => {
				return (
					<Button
						key={name + index}
						asChild
						className="hover:cursor-pointer bg-button2 hover:bg-button1"
					>
						<Link href={data.route} className="mb-2">
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
			});
	}, [pathName]);

	if (!pathName && typeof window === 'undefined') {
		return null;
	}

	if (links && links.length > 0) {
		return (
			<div className="flex min-h-screen flex-col w-full">
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
						description="The page you were looking for doesn't exist"
						badgeColor="bg-purple-200"
					/>
					<div className="mt-8 text-center flex flex-col items-center">
						<h1 className="mb-4">Did you mean:</h1>
						{links}
					</div>
				</SectionContainer>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col w-full">
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
					description="The page you were looking for doesn't exist"
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
