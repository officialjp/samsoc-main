import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

import InView from '@/components/scroll-view-card';

interface SectionContainerProps {
	id?: string;
	className?: string;
	children: ReactNode;
}

export function SectionContainer({
	id,
	className,
	children,
}: SectionContainerProps) {
	return (
		<InView
			id={id}
			tag="section"
			className={cn('w-full py-6 md:py-12 lg:py-16', className)}
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
				{children}
			</div>
		</InView>
	);
}
