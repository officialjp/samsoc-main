'use client';

import React, { useState } from 'react';
import { cn } from '~/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CacheCountdown from './cache-countdown';

export interface NavigationItem {
	name: string;
	href?: string;
	page?: React.ReactElement;
	icon?: React.ReactNode;
	/** Prisma Accelerate cache TTL in seconds (omit if no caching) */
	ttlSeconds?: number;
}

export interface GenericNavigationProps {
	items: NavigationItem[];
	mode?: 'tabs' | 'links';
	headerClassName?: string;
	currentPath?: string;
}

export default function GenericNavigation({
	items,
	mode = 'tabs',
	headerClassName,
	currentPath,
}: GenericNavigationProps) {
	const pathname = usePathname();
	const [pageIndex, setPageIndex] = useState<number>(0);

	if (mode === 'links') {
		const pathToCheck = currentPath ?? pathname;
		const currentPageName = pathToCheck.split('/').pop();

		return (
			<nav
				className={cn(
					'flex gap-2 flex-wrap justify-center',
					headerClassName,
				)}
				aria-label="Section navigation"
			>
				{items
					.filter((item) => {
						if (!item.href) return false;
						const itemPageName = item.href.split('/').pop();
						return itemPageName !== currentPageName;
					})
					.map(({ name, href, icon }) => (
						<Link
							key={name + href}
							href={href ?? '#'}
							className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black rounded-full bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 transition-all"
						>
							{icon}
							<span>{name}</span>
						</Link>
					))}
			</nav>
		);
	}

	// Tab-based navigation with neubrutalist design
	return (
		<div className="w-full">
			<div
				className={cn('flex gap-2 mb-6 flex-wrap', headerClassName)}
				role="tablist"
				aria-label="Dashboard sections"
			>
				{items.map(({ name, icon }, index) => {
					const isActive = index === pageIndex;

					return (
						<button
							key={name + index}
							onClick={() => setPageIndex(index)}
							role="tab"
							aria-selected={isActive}
							aria-controls={`tabpanel-${index}`}
							className={cn(
								'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold border-2 border-black rounded-xl transition-all cursor-pointer',
								isActive
									? 'bg-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
									: 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50',
							)}
						>
							{icon}
							<span>{name}</span>
						</button>
					);
				})}
			</div>
			{items[pageIndex]?.ttlSeconds && (
				<div className="flex justify-end mb-4">
					<CacheCountdown ttlSeconds={items[pageIndex].ttlSeconds} />
				</div>
			)}
			<section
				id={`tabpanel-${pageIndex}`}
				role="tabpanel"
				aria-labelledby={`tab-${pageIndex}`}
			>
				{items[pageIndex]?.page}
			</section>
		</div>
	);
}
