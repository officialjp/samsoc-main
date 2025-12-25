'use client';

import GenericNavigation from './generic-navigation';

interface DashboardTabs {
	name: string;
	page: React.ReactElement;
}

interface DashboardTabsProps {
	tabData: DashboardTabs[];
}

export default function DashboardTabs({ tabData }: DashboardTabsProps) {
	const navigationItems = tabData.map((tab) => ({
		name: tab.name,
		page: tab.page,
	}));

	return <GenericNavigation items={navigationItems} mode="tabs" />;
}
