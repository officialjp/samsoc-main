'use client';

import GenericNavigation from './generalized/generic-navigation';

interface DashboardTabs {
	name: string;
	page: React.ReactElement;
}

interface DashboardTabArray {
	tabData: DashboardTabs[];
}

export default function DashboardTabArray({ tabData }: DashboardTabArray) {
	const navigationItems = tabData.map((tab) => ({
		name: tab.name,
		page: tab.page,
	}));

	return <GenericNavigation items={navigationItems} mode="tabs" />;
}
