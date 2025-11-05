'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import supabase from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InView from '@/components/scroll-view-card';
import Marquee from '../marquee';
import SAMSOC from '@/public/images/logo.png';
import { SvgIcon } from '../util/svgIcon';
import SurreyLogo from '@/public/surrey.svg';

export function HeroSection() {
	const [carouselData, setCarouselData] = useState<React.ReactNode[]>();

	useEffect(() => {
		async function fetchCarouselData() {
			try {
				const { data } = await supabase.from('carousel').select('*');
				if (data) {
					const SLIDES: React.ReactNode[] = [];
					for (const element of data) {
						if (
							(element.isMobile && !isMobile) ||
							(!element.isMobile && isMobile)
						)
							continue;

						SLIDES.push(
							<div key={element.id} className="h-full w-full">
								<div className="h-full w-full">
									<Image
										src={element.src}
										alt={element.description}
										height={isMobile ? 1080 : 1920}
										width={isMobile ? 1080 : 1920}
										className="object-cover object-top w-full h-full"
									/>
								</div>
							</div>,
						);
					}

					setCarouselData(SLIDES);
				}
			} catch (e: unknown) {
				if (typeof e === 'string') {
					console.error('brokey');
				} else if (e instanceof Error) {
					console.error(e.message);
				}
			}
		}

		fetchCarouselData();
	}, []);

	const OPTIONS: EmblaOptionsType = { loop: true };

	return (
		<InView>
			<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-[3vh] SAManim SAMfade-up SAMduration-700 SAMdelay-200 SAMbounce">
				<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
					<HeroCarousel
						slides={carouselData}
						options={OPTIONS}
						useSocials={true}
					></HeroCarousel>
				</div>
				<Marquee className="mt-20 mask-[linear-gradient(90deg,hsla(0,0%,0%,0)_0%,hsla(0,0%,0%,1)_10%,hsla(0,0%,0%,1)_90%,hsla(0,0%,0%,0)_100%)]">
					<div className="flex gap-10 items-center mr-10">
						<span className="flex items-center gap-2">
							<p>Developed by:</p>
							<p>
								{['J.P', 'Michael', 'Maiham', 'David'].join(
									', ',
								)}
							</p>
						</span>
						<span>●</span>
						<span className="flex items-center gap-2">
							<p>A community for students at</p>
							<div className="relative w-fit h-fit block px-2">
								<SvgIcon
									className="bg-black"
									height={50}
									width={130}
									src={SurreyLogo.src}
								></SvgIcon>
							</div>
						</span>
						<span>●</span>
						<span className="flex items-center gap-2 ">
							<p>Made with love for</p>
							<div className="relative w-[50px] h-fit block mx-2">
								<Image
									src={SAMSOC.src}
									height={50}
									width={50}
									alt="samsoc logo"
								></Image>
							</div>
						</span>
						<span>●</span>
					</div>
				</Marquee>
			</section>
		</InView>
	);
}
