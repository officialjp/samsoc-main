'use client';

import type { EmblaOptionsType } from 'embla-carousel';
import { DotButton, useDotButton } from './hero-carousel-button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Carousel } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { SvgIcon } from '../util/svg-icon';

type CarouselType = {
	slides: Carousel[];
	options?: EmblaOptionsType;
	useSocials: boolean;
};

const autoplayOptions = {
	delay: 5000,
	stopOnInteraction: true,
} as const;

const plugins = [Autoplay(autoplayOptions)];

export default function HeroCarousel({
	slides,
	options,
	useSocials,
}: CarouselType) {
	const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	if (slides.length === 0) {
		return (
			<div className="w-full max-w-[min(1200px,calc(100%-20px))] rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
				No carousel slides available.
			</div>
		);
	}

	return (
		<section className="relative m-auto flex h-fit w-full flex-col items-center">
			<div
				className="w-full max-w-[min(1200px,calc(100%-20px))] cursor-grab overflow-hidden rounded-2xl shadow-[0px_5px_10px_#00000090] active:cursor-grabbing md:rounded-4xl"
				ref={emblaRef}
			>
				<div className="flex touch-pan-y touch-pinch-zoom">
					{slides.map((element, index) => {
						const isFirst = index === 0;
						return (
							<div
								className="relative aspect-9/16 min-w-0 flex-[0_0_100%] md:aspect-video"
								key={element.id}
							>
								<Image
									src={element.mobileSource}
									alt={element.alt}
									fill
									sizes="(max-width: 768px) 100vw, 1px"
									priority={isFirst}
									fetchPriority={isFirst ? 'high' : 'auto'}
									quality={75}
									className="object-cover md:hidden"
								/>
								<Image
									src={element.desktopSource}
									alt={element.alt}
									fill
									sizes="(max-width: 768px) 0px, (max-width: 1200px) 100vw, 1200px"
									priority={isFirst}
									fetchPriority={isFirst ? 'high' : 'auto'}
									quality={75}
									className="hidden object-cover md:block"
								/>
							</div>
						);
					})}
				</div>
			</div>

			{useSocials && (
				<div className="absolute -bottom-1 hidden w-full max-w-[1200px] flex-row flex-nowrap gap-4 lg:flex">
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

			<div className="relative mt-7 flex items-center justify-center gap-2">
				{scrollSnaps.map((_, index) => (
					<DotButton
						key={index}
						onClick={() => onDotButtonClick(index)}
						aria-label={`Go to slide ${index + 1}`}
						className={`h-6 w-6 cursor-pointer appearance-none rounded-full border-2 border-black bg-pink-300 transition-all hover:bg-pink-400 ${
							index === selectedIndex
								? 'w-12 bg-pink-500 hover:bg-pink-600'
								: ''
						}`}
					/>
				))}
			</div>
		</section>
	);
}
