'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import Banner from '@/public/images/SAMSoC_banner.png';
import MobileBanner from '@/public/images/SAMSoC_banner potrait.png';
import { DynamicIcon } from 'lucide-react/dynamic';
// Data for the awards
const awardsData = [
	{
		title: 'Society of the Year 2024/25',
		description: 'Student Union Awards',
		icon: 'trophy',
	},
	{
		title: 'Society of the Year 2022/23',
		description: 'Student Union Awards',
		icon: 'trophy',
	},
	{
		title: 'Society of the Year 2021/22',
		description: 'Student Union Awards',
		icon: 'trophy',
	},
	{
		title: 'Alan Sutherland Award 2022/23',
		description: 'Student Union Awards',
		icon: 'ribbon',
	},
	{
		title: 'Gold RAG Award 2021/22',
		description: 'Student Union Awards',
		icon: 'star',
	},
];

export function HeroSection() {
	const OPTIONS: EmblaOptionsType = { loop: true };
	const SLIDES = [
		<div className="bg-red-400 h-full w-full">
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

		<div className="relative h-full w-full border-2 border-solid rounded-4xl flex items-center justify-center">
			<div className="absolute top-0 left-0 w-full py-5">
				<h1 className="w-full text-center"> our achievements </h1>
			</div>

			<ul>
				{awardsData.map((event, index) => {
					return (
						<li
							key={index}
							className="flex justify-center items-center mb-3"
						>
							<DynamicIcon
								name={event.icon}
								size={32}
								className="mr-3"
							/>
							<span className="flex flex-col">
								<h1>{event.title}</h1>
								<p>{event.description}</p>
							</span>
						</li>
					);
				})}
			</ul>
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
