'use client';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { InView } from 'react-intersection-observer';

export default function ScrollViewCard({
	children,
	triggerOnce = true,
	tag = 'div',
	className,
	id,
}: {
	children: React.ReactElement<ReactNode>;
	tag?: any;
	triggerOnce?: boolean;
	className?: string;
	id?: string;
}) {
	return (
		<InView
			triggerOnce={triggerOnce}
			threshold={0.2}
			as={tag}
			id={id}
			className={cn('SAManimController', className)}
			onChange={(visible, entry) => {
				if (visible) {
					if (entry.target.classList.contains('SAMactive')) return;
					setTimeout(() => {
						entry.target.classList.add('SAMactive');
					}, 100);
				}
			}}
		>
			{children}
		</InView>
	);
}
