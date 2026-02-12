'use client';

import GenericNavigation from './generic-navigation';

interface DashboardTab {
	name: string;
	page: React.ReactElement;
	/** Prisma Accelerate cache TTL in seconds (omit if no caching) */
	ttlSeconds?: number;
}

interface DashboardTabsProps {
	tabData: DashboardTab[];
}

export default function DashboardTabs({ tabData }: DashboardTabsProps) {
	const navigationItems = tabData.map((tab) => ({
		name: tab.name,
		page: tab.page,
		ttlSeconds: tab.ttlSeconds,
	}));

	return <GenericNavigation items={navigationItems} mode="tabs" />;
}
