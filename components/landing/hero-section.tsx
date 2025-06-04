'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import Banner from '@/public/images/SAMSoC_banner.png';

// Data for the awards
// const awardsData = [
// 	{
// 		title: 'Society of the Year 2024/25',
// 		description: 'Student Union Awards',
// 		icon: Trophy,
// 	},
// 	{
// 		title: 'Society of the Year 2022/23',
// 		description: 'Student Union Awards',
// 		icon: Trophy,
// 	},
// 	{
// 		title: 'Society of the Year 2021/22',
// 		description: 'Student Union Awards',
// 		icon: Trophy,
// 	},
// 	{
// 		title: 'Alan Sutherland Award 2022/23',
// 		description: 'Student Union Awards',
// 		icon: Ribbon,
// 	},
// 	{
// 		title: 'Gold RAG Award 2021/22',
// 		description: 'Student Union Awards',
// 		icon: Star,
// 	},
// ];

export function HeroSection() {
	const OPTIONS: EmblaOptionsType = { loop: true };
	const SLIDES = [
		<div className="bg-red-400 h-full w-full"><Image src={Banner} alt='samsoc-banner'/></div>,
		<div className="bg-red-400 h-full w-full"></div>,
	];

	return (
		<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-10">
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
