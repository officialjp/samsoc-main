'use client';

import { cn } from '~/lib/utils';
import { InView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

export type AnimationVariant =
	| 'fadeInUp'
	| 'fadeIn'
	| 'fadeInRight'
	| 'fadeInLeft'
	| 'fadeInRotate'
	| 'fadeInRotate3'
	| 'fadeInScale';

interface ScrollAnimationWrapperProps {
	children: ReactNode;
	tag?:
		| 'div'
		| 'section'
		| 'article'
		| 'main'
		| 'aside'
		| 'header'
		| 'footer'
		| 'nav';
	triggerOnce?: boolean;
	className?: string;
	id?: string;
	variant?: AnimationVariant;
	delay?: number;
	threshold?: number;
}

export default function ScrollAnimationWrapper({
	children,
	triggerOnce = true,
	tag = 'div',
	className,
	id,
	variant = 'fadeInUp',
	delay = 0,
	threshold = 0.15,
}: ScrollAnimationWrapperProps) {
	return (
		<InView
			triggerOnce={triggerOnce}
			threshold={threshold}
			as={tag}
			id={id}
			className={cn('SAManimController', className)}
			onChange={(visible, entry) => {
				if (visible) {
					if (entry.target.classList.contains('SAMactive')) return;

					const element = entry.target as HTMLElement;
					element.style.setProperty(
						'--animation-delay',
						`${delay}ms`,
					);
					element.setAttribute('data-animation', variant);

					setTimeout(() => {
						element.classList.add('SAMactive');
					}, 50);
				}
			}}
		>
			{children}
		</InView>
	);
}
