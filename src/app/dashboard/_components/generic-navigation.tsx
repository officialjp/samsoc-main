'use client';

import React, { useState } from 'react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavigationItem {
	name: string;
	href?: string;
	page?: React.ReactElement;
}

export interface GenericNavigationProps {
	items: NavigationItem[];
	mode?: 'tabs' | 'links';
	headerClassName?: string;
	activeButtonClassName?: string;
	inactiveButtonClassName?: string;
	currentPath?: string;
}

export default function GenericNavigation({
	items,
	mode = 'tabs',
	headerClassName = 'flex gap-3 mb-5 flex-wrap',
	activeButtonClassName = 'bg-purple-200',
	inactiveButtonClassName = '',
	currentPath,
}: GenericNavigationProps) {
	const pathname = usePathname();
	const [pageIndex, setPageIndex] = useState<number>(0);

	if (mode === 'links') {
		const pathToCheck = currentPath ?? pathname;
		const currentPageName = pathToCheck.split('/').pop();

		return (
			<div className={headerClassName}>
				{items
					.filter((item) => {
						if (!item.href) return false;
						const itemPageName = item.href.split('/').pop();
						return itemPageName !== currentPageName;
					})
					.map(({ name, href }, index) => (
						<Button
							key={name + index}
							asChild
							className="hover:cursor-pointer bg-button2 hover:bg-button1 cursor-pointer grow"
						>
							<Link href={href ?? '#'}>{name}</Link>
						</Button>
					))}
			</div>
		);
	}

	// Tab-based navigation
	return (
		<div>
			<header className={headerClassName}>
				{items.map(({ name }, index) => (
					<Button
						className={cn(
							'cursor-pointer grow',
							index === pageIndex
								? activeButtonClassName
								: inactiveButtonClassName,
						)}
						key={name + index}
						onClick={() => setPageIndex(index)}
					>
						{name}
					</Button>
				))}
			</header>
			<section>{items[pageIndex]?.page}</section>
		</div>
	);
}
