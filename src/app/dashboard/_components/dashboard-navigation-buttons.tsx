'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '~/lib/utils';
import {
	Calendar,
	Image,
	Home,
	BookOpen,
	Gamepad2,
	BarChart3,
	TrendingUp,
	LayoutDashboard,
} from 'lucide-react';

const dashPages = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		name: 'Calendar',
		href: '/dashboard/calendar',
		icon: Calendar,
	},
	{
		name: 'Gallery',
		href: '/dashboard/gallery',
		icon: Image,
	},
	{
		name: 'Landing',
		href: '/dashboard/landing',
		icon: Home,
	},
	{
		name: 'Library',
		href: '/dashboard/library',
		icon: BookOpen,
	},
	{
		name: 'Games',
		href: '/dashboard/games',
		icon: Gamepad2,
	},
	{
		name: 'Anime Stats',
		href: '/dashboard/stats/anime',
		icon: BarChart3,
	},
	{
		name: 'General Stats',
		href: '/dashboard/stats/general',
		icon: TrendingUp,
	},
];

export default function DashboardNavigationButtons() {
	const pathname = usePathname();

	return (
		<nav
			className="flex gap-2 flex-wrap justify-center"
			aria-label="Dashboard navigation"
		>
			{dashPages.map((page) => {
				const isActive = pathname === page.href;
				const Icon = page.icon;

				return (
					<Link
						key={page.href}
						href={page.href}
						className={cn(
							'inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black rounded-full transition-all',
							isActive
								? 'bg-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-0 translate-y-0'
								: 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50',
						)}
						aria-current={isActive ? 'page' : undefined}
					>
						<Icon className="w-4 h-4" aria-hidden="true" />
						<span>{page.name}</span>
					</Link>
				);
			})}
		</nav>
	);
}
