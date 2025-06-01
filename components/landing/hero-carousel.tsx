import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import {
	DotButton,
	useDotButton,
} from '@/components/landing/hero-carousel-button';
import Instagram from '@/public/instagram.svg';
import Facebook from '@/public/facebook.svg';
import Discord from '@/public/discord.svg';
import useIsMobile from '../mobile-check';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { SvgIcon } from '@/components/util/svgIcon';

type PropType = {
	slides?: any;
	options?: EmblaOptionsType;
	useSocials: boolean;
};

export default function HeroCarousel({
	slides,
	options,
	useSocials,
}: PropType) {
	const [emblaRef, emblaApi] = useEmblaCarousel(options);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	return (
		<section className="relative w-full m-auto h-fit flex flex-col items-center">
			<div
				className="overflow-hidden w-full max-w-[1200px] rounded-0 md:rounded-4xl aspect-[16/9]"
				ref={emblaRef}
			>
				<div className="flex touch-pinch-zoom h-full touch-pan-y ml-[calc(1rem * -1)]">
					{slides &&
						slides.map((elements: any, index: number) => (
							<div
								className="transform-[translate3d(0,0,0)] flex-[0 0 70%] grow-0 shrink-0 w-full mx-[1rem] h-full"
								key={index}
							>
								<div className="w-full h-full relative overflow-hidden rounded-0 md:rounded-4xl">
									{elements}
								</div>
							</div>
						))}
				</div>
			</div>

			{useSocials && !useIsMobile() && (
				<div className="flex flex-row gap-4 flex-nowrap w-full max-w-[1200px] absolute -bottom-1">
					<Link href="https://www.instagram.com/unisamsoc/?hl=en">
						<SvgIcon
							src={Instagram.src}
							height={32}
							width={32}
							className={'bg-[#ff0069]'}
						></SvgIcon>
					</Link>
					<Link href="https://www.facebook.com/UniSAMSoc">
						<SvgIcon
							src={Facebook.src}
							height={32}
							width={32}
							className={'bg-[#0866ff]'}
						></SvgIcon>
					</Link>
					<Link href="https://www.discord.com">
						<SvgIcon
							src={Discord.src}
							height={32}
							width={32}
							className={'bg-[#5865f2]'}
						></SvgIcon>
					</Link>
				</div>
			)}

			<div className="relative grid grid-cols-[auto 1fr] content-between gap-[1.2rem] mt-[1.8rem]">
				<div className="flex flex-wrap content-end items-center mr-[calc((2.6rem - 1.4rem) / 2 * -1)]">
					{scrollSnaps.map((_, index) => (
						<DotButton
							key={index}
							onClick={() => onDotButtonClick(index)}
							className={`appearance-none inline-flex mx-2 items-center justify-center whitespace-nowrap rounded-[50%] text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none h-6 w-6 px-2 py-2 bg-pink-300 cursor-pointer hover:bg-pink-400 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
								index === selectedIndex
									? 'bg-pink-500 hover:bg-pink-600'
									: ''
							}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
