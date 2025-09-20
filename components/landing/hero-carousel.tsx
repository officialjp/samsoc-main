'use client';
import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import {
	DotButton,
	useDotButton,
} from '@/components/landing/hero-carousel-button';
import Instagram from '@/public/instagram.svg';
import Facebook from '@/public/facebook.svg';
import Discord from '@/public/discord.svg';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { SvgIcon } from '@/components/util/svgIcon';
import { useState } from 'react';
import { X } from 'lucide-react';

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
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		Autoplay({
			delay: 5000,
		}),
	]);
	const [isOpen, setIsOpen] = useState(false);

	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	return (
		<section className="relative w-full m-auto h-fit flex flex-col items-center">
			<div
				className="overflow-hidden w-full max-w-[1200px] max-h-[calc(85vh-80px)] rounded-0 md:rounded-4xl aspect-[9/16] md:aspect-[16/9] lg:aspect-[16/9] xl:aspect-[16/9]"
				ref={emblaRef}
			>
				<div className="flex touch-pinch-zoom h-full touch-pan-y">
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

			{useSocials && (
				<div className=" flex-row gap-4 flex-nowrap w-full max-w-[1200px] absolute -bottom-1 hidden lg:flex">
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
					<button
						className="cursor-pointer"
						onClick={() => setIsOpen(true)}
					>
						<SvgIcon
							src={Discord.src}
							height={32}
							width={32}
							className="bg-[#7289da]"
						></SvgIcon>
					</button>
					{isOpen && (
						<div
							className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 hover:cursor-pointer"
							onClick={() => setIsOpen(false)}
						>
							<div className="relative max-w-5xl max-h-[90vh] bg-white rounded-md border-4 border-black p-2 hover:cursor-default">
								<button
									className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:cursor-pointer"
									onClick={() => setIsOpen(false)}
								>
									<X className="h-6 w-6" />
								</button>
								<p className="mt-2 text-center font-medium">
									The discord link can be found in our
									Microsoft Teams, please wait up to 24 hours
									to get added to the teams once you have
									acquired a membership!
								</p>
							</div>
						</div>
					)}
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
