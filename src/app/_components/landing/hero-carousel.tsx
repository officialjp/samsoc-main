'use client';

import React from 'react';
import type { EmblaOptionsType } from 'embla-carousel';
import { DotButton, useDotButton } from './hero-carousel-button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { SvgIcon } from '../util/svg-icon';
import type { Carousel } from 'generated/prisma';
import Image from 'next/image';
import Link from 'next/link';

type CarouselType = {
	slides: Carousel[];
	options?: EmblaOptionsType;
	useSocials: boolean;
};

export default function HeroCarousel({
	slides,
	options,
	useSocials,
}: CarouselType) {
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		Autoplay({
			delay: 5000,
			stopOnInteraction: true,
		}),
	]);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	if (slides.length === 0) {
		return (
			<div className="w-full max-w-[min(1200px,calc(100%-20px))] p-8 text-center text-gray-500 rounded-2xl border border-dashed border-gray-300">
				No carousel slides available.
			</div>
		);
	}

	return (
		<section className="relative w-full m-auto h-fit flex flex-col items-center">
			<div
				className="overflow-hidden w-full max-w-[min(1200px,calc(100%-20px))] shadow-[0px_5px_10px_#00000090] rounded-2xl md:rounded-4xl cursor-grab active:cursor-grabbing"
				ref={emblaRef}
			>
				<div className="flex touch-pinch-zoom touch-pan-y">
					{slides.map((element, index) => (
						<div
							className="relative flex-[0_0_100%] min-w-0 aspect-9/16 md:aspect-video"
							key={element.id}
						>
							<Image
								src={element.mobileSource}
								alt={element.alt}
								fill
								sizes="(max-width: 768px) 100vw, 0px"
								quality={index === 0 ? 85 : 75}
								priority={index === 0}
								loading={index === 0 ? 'eager' : 'lazy'}
								fetchPriority={index === 0 ? 'high' : 'auto'}
								className="object-cover md:hidden"
							/>

							<Image
								src={element.desktopSource}
								alt={element.alt}
								fill
								sizes="(max-width: 768px) 0px, (max-width: 1200px) 100vw, 1200px"
								quality={index === 0 ? 85 : 75}
								priority={index === 0}
								loading={index === 0 ? 'eager' : 'lazy'}
								fetchPriority={index === 0 ? 'high' : 'auto'}
								className="object-cover hidden md:block"
							/>
						</div>
					))}
				</div>
			</div>

			{useSocials && (
				<div className="flex-row gap-4 flex-nowrap w-full max-w-[1200px] absolute -bottom-1 hidden lg:flex">
					<Link
						href="https://www.instagram.com/unisamsoc/?hl=en"
						aria-label="Visit our Instagram"
						prefetch={false}
					>
						<SvgIcon
							src="/instagram.svg"
							height={32}
							width={32}
							className="bg-[#ff0069]"
						/>
					</Link>
					<Link
						href="https://www.facebook.com/UniSAMSoc"
						aria-label="Visit our Facebook"
						prefetch={false}
					>
						<SvgIcon
							src="/facebook.svg"
							height={32}
							width={32}
							className="bg-[#0866ff]"
						/>
					</Link>
					<Link
						href="https://discord.gg/tQUrdxzUZ4"
						aria-label="Join our Discord"
						prefetch={false}
					>
						<SvgIcon
							src="/discord.svg"
							height={32}
							width={32}
							className="bg-[#5865F2]"
						/>
					</Link>
				</div>
			)}

			<div className="relative flex items-center justify-center gap-2 mt-7">
				{scrollSnaps.map((_, index) => (
					<DotButton
						key={index}
						onClick={() => onDotButtonClick(index)}
						aria-label={`Go to slide ${index + 1}`}
						className={`appearance-none rounded-full transition-all h-6 w-6 bg-pink-300 cursor-pointer hover:bg-pink-400 border border-black ${
							index === selectedIndex
								? 'bg-pink-500 hover:bg-pink-600 w-8'
								: ''
						}`}
					/>
				))}
			</div>
		</section>
	);
}
