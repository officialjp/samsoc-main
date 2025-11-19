'use client';
import { cn } from '~/lib/utils';
import { Button } from '../ui/button';
import { useState } from 'react';

interface DashboardTabs {
	name: string;
	page: React.ReactElement;
}

interface DashboardTabArray {
	tabData: DashboardTabs[];
}

export default function DashboardTabArray({ tabData }: DashboardTabArray) {
	const [pageIndex, setPageIndex] = useState<number>(0);

	return (
		<div>
			<header className="flex gap-3 mb-5 flex-wrap">
				{tabData.map(({ name }, index) => {
					return (
						<Button
							className={cn(
								'cursor-pointer grow',
								index === pageIndex ? 'bg-purple-200' : '',
							)}
							key={name + index}
							onClick={() => setPageIndex(index)}
						>
							{name}
						</Button>
					);
				})}
			</header>
			<section>{tabData[pageIndex]?.page}</section>
		</div>
	);
}
