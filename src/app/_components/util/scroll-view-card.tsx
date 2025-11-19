'use client';
import { cn } from '~/lib/utils';
import { InView } from 'react-intersection-observer';

export default function ScrollViewCard({
	children,
	triggerOnce = true,
	tag = 'div',
	className,
	id,
}: {
	children: React.ReactNode;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tag?: any;
	triggerOnce?: boolean;
	className?: string;
	id?: string;
}) {
	return (
		<InView
			triggerOnce={triggerOnce}
			threshold={0.2}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
