import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
		<section
			id={id}
			className={cn('w-full py-6 md:py-12 lg:py-16', className)}
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
				{children}
			</div>
		</section>
	);
}
