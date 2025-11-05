'use client';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef, useState, Suspense } from 'react';

export default function Marquee({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	let position = 0;
	const [scrollCount, setScrollCount] = useState(2);
	const subContainerRef = useRef(null);
	const requestRef = useRef(0);

	const updateSize = (self: HTMLElement, window: Window) => {
		if (self && self.offsetWidth) {
			if (window.innerWidth > self.offsetWidth) {
				setScrollCount(
					Math.floor((window.innerWidth / self.offsetWidth) * 2) + 2,
				);
			}
		}
	};

	useEffect(() => {
		if (subContainerRef.current)
			updateSize(subContainerRef.current, window);
		requestRef.current = requestAnimationFrame(() => {
			if (subContainerRef.current) moveMarquee(subContainerRef.current);
		});

		return () => {
			cancelAnimationFrame(requestRef.current);
		};
	});

	const moveMarquee = (self: HTMLElement) => {
		position += 0.1;
		if (position > self.offsetWidth / scrollCount) position = 0;
		self.style.marginLeft = `-${position}px`;
		requestRef.current = requestAnimationFrame(() => {
			if (subContainerRef.current) moveMarquee(subContainerRef.current);
		});
	};

	return (
		<div
			className={cn(
				'relative w-full h-fit overflow-hidden select-none',
				className,
			)}
		>
			<div
				ref={subContainerRef}
				className="relative flex flex-row mr-0 items-center w-fit h-fit justify-baseline"
			>
				<Suspense fallback={<div hidden></div>}>
					{new Array(scrollCount).fill(0).map((_, index) => {
						return (
							<div
								className="h-fit flex relative items-center shrink-0 whitespace-nowrap"
								key={index + 'marquee'}
							>
								{children}
							</div>
						);
					})}
				</Suspense>
			</div>
		</div>
	);
}
