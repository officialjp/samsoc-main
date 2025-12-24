'use client';

import { usePathname } from 'next/navigation';
import GenericNavigation from './generalized/generic-navigation';

export default function DashButtons() {
	const pathname = usePathname();

	const dashPages = [
		{ name: 'Calendar Dashboard', href: '/dashboard/calendar' },
		{ name: 'Gallery Dashboard', href: '/dashboard/gallery' },
		{ name: 'Landing Dashboard', href: '/dashboard/landing' },
		{ name: 'Library Dashboard', href: '/dashboard/library' },
		{ name: 'Games Dashboard', href: '/dashboard/games' },
	];

	return (
		<GenericNavigation
			items={dashPages}
			mode="links"
			headerClassName="flex gap-3 mb-5 flex-wrap mt-3"
			currentPath={pathname}
		/>
	);
}
