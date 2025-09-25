'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import supabase from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import InView from '@/components/scroll-view-card';

interface CarouselType {
	id: number;
	description: string;
	src: string;
	public_url: string;
	isMobile: boolean;
}

export function HeroSection() {
	const [carouselData, setCarouselData] = useState<
		React.ReactNode[] | null
	>();

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
										src={element.public_url}
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
			} catch (err: any) {
				console.error(err.message);
			}
		}

		fetchCarouselData();
	}, []);

	const OPTIONS: EmblaOptionsType = { loop: true };

	console.log(carouselData);
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
			</section>
		</InView>
	);
}
