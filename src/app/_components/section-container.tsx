import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

interface SectionContainerProps {
	id?: string;
	className?: string;
	children: ReactNode;
}

export function SectionContainer({
	children,
	className,
}: SectionContainerProps) {
	return (
		<div className={cn('w-full py-6 md:py-12 lg:py-16', className)}>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
				{children}
			</div>
		</div>
	);
}
