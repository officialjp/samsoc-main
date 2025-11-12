'use client';
import React, { useEffect, useState } from 'react';
import type { EmblaOptionsType } from 'embla-carousel';
import { DotButton, useDotButton } from './hero-carousel-button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { SvgIcon } from '../util/svg-icon';
import type { Carousel } from 'generated/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

type CarouselType = {
	slides: Carousel[];
	options?: EmblaOptionsType;
	useSocials: boolean;
};

const useClientLayout = () => {
	const [isClientMobile, setIsClientMobile] = useState<boolean | null>(null);
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
		setIsClientMobile(isMobile);
	}, []);

	return { isClientMobile, hasMounted };
};

interface ClientContentProps extends CarouselType {
	isClientMobile: boolean;
}

const ClientCarouselContent: React.FC<ClientContentProps> = ({
	slides,
	options,
	useSocials,
	isClientMobile,
}) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		Autoplay({
			delay: 5000,
		}),
	]);

	const filteredSlides = slides.filter(
		(element) => element.isMobile === isClientMobile,
	);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	if (filteredSlides.length === 0) {
		return (
			<div className="w-full max-w-[min(1200px,calc(100%-20px))] p-8 text-center text-gray-500 rounded-2xl border border-dashed border-gray-300">
				No carousel slides available for this device view.
			</div>
		);
	}

	return (
		<section className="relative w-full m-auto h-fit flex flex-col items-center">
			<div
				className="overflow-hidden w-full max-w-[min(1200px,calc(100%-20px))] shadow-[0px_5px_10px_#00000090] rounded-2xl md:rounded-4xl aspect-9/16 md:aspect-video lg:aspect-video xl:aspect-video cursor-grab active:cursor-grabbing"
				ref={emblaRef}
			>
				<div className="flex touch-pinch-zoom h-full touch-pan-y">
					{filteredSlides.map((element: Carousel, index: number) => (
						<div
							className="transform-[translate3d(0,0,0)] flex-[0 0 70%] grow-0 shrink-0 w-full mx-4 h-full"
							key={element.id}
						>
							<div className="w-full h-full relative overflow-hidden rounded-2xl md:rounded-4xl">
								<Image
									src={element.source}
									alt={element.alt}
									fill
									sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 768px) calc(100vw - 40px), (max-width: 1024px) 750px, 1200px"
									quality={85}
									priority={index === 0}
									loading={index === 0 ? 'eager' : 'lazy'}
									className="object-cover object-top"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{useSocials && (
				<div className=" flex-row gap-4 flex-nowrap w-full max-w-[1200px] absolute -bottom-1 hidden lg:flex">
					<Link href="https://www.instagram.com/unisamsoc/?hl=en">
						<SvgIcon
							src={'/instagram.svg'}
							height={32}
							width={32}
							className={'bg-[#ff0069]'}
						/>
					</Link>
					<Link href="https://www.facebook.com/UniSAMSoc">
						<SvgIcon
							src={'/facebook.svg'}
							height={32}
							width={32}
							className={'bg-[#0866ff]'}
						/>
					</Link>
					<Link href="https://discord.gg/tQUrdxzUZ4">
						<SvgIcon
							src={'/discord.svg'}
							height={32}
							width={32}
							className={'bg-[#5865F2]'}
						/>
					</Link>
				</div>
			)}

			<div className="relative grid grid-cols-[auto 1fr] content-between gap-[1.2rem] mt-[1.8rem]">
				<div className="flex flex-wrap content-end items-center mr-[calc((2.6rem - 1.4rem) / 2 * -1)]">
					{scrollSnaps.map((_, index) => (
						<DotButton
							key={index}
							onClick={() => onDotButtonClick(index)}
							className={`appearance-none inline-flex mx-2 items-center justify-center whitespace-nowrap rounded-full text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none h-6 w-6 px-2 py-2 bg-pink-300 cursor-pointer hover:bg-pink-400 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
								index === selectedIndex
									? 'bg-pink-500 hover:bg-pink-600 w-[50px]'
									: ''
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default function HeroCarousel(props: CarouselType) {
	const { isClientMobile, hasMounted } = useClientLayout();

	if (!hasMounted || isClientMobile === null) {
		return (
			<div className="w-full max-w-[min(1200px,calc(100%-20px))] shadow-[0px_5px_10px_#00000090] rounded-2xl md:rounded-4xl aspect-9/16 md:aspect-video bg-gray-200 animate-pulse"></div>
		);
	}

	return <ClientCarouselContent {...props} isClientMobile={isClientMobile} />;
}
