'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import Banner from '@/public/images/SAMSoC_banner.png';
import MobileBanner from '@/public/images/SAMSoC_banner potrait.png';
import ClubNightBanner from '@/public/images/lmfao-honobono-horizontal.png';
import MobileClubNight from '@/public/images/vertical-honobono.png';

export function HeroSection() {
	const OPTIONS: EmblaOptionsType = { loop: true };
	const SLIDES = [
		<div className="h-full w-full">
			<div className="md:hidden h-full w-full">
				<Image
					src={MobileClubNight}
					alt="samsoc-banner-iceBreaker"
					className="object-cover object-top w-full h-full"
				/>
			</div>
			<div className="hidden md:inline-flex h-full w-full">
				<Image
					src={ClubNightBanner}
					alt="samsoc-banner-iceBreaker"
					className="object-cover object-center w-full h-full"
				/>
			</div>
		</div>,
		<div className="h-full w-full">
			<div className="md:hidden h-full w-full">
				<Image
					src={MobileBanner}
					alt="samsoc-banner"
					className="object-cover object-top w-full h-full"
				/>
			</div>
			<div className="hidden md:inline-flex h-full w-full">
				<Image
					src={Banner}
					alt="samsoc-banner"
					className="object-cover object-center w-full h-full"
				/>
			</div>
		</div>,
	];

	return (
		<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-[3vh]">
			<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
				<HeroCarousel
					slides={SLIDES}
					options={OPTIONS}
					useSocials={true}
				></HeroCarousel>
			</div>
		</section>
	);
}
