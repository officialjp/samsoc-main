'use client';

import HeroCarousel from '@/components/landing/hero-carousel';
import { EmblaOptionsType } from 'embla-carousel';
import Image from 'next/image';
import supabase from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

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
					let SLIDES: React.ReactNode[] = [];
					for (const element of data) {
						console.log(element);
						if (element.isMobile) {
							SLIDES.push(
								<div key={element.id} className="h-full w-full">
									<div className="md:hidden h-full w-full">
										<Image
											src={element.public_url}
											alt={element.description}
											height={1080}
											width={1920}
											className="object-cover object-top w-full h-full"
										/>
									</div>
								</div>,
							);
						} else {
							SLIDES.push(
								<div key={element.id} className="h-full w-full">
									<div className="md:hidden h-full w-full">
										<Image
											src={element.public_url}
											alt={element.description}
											height={1920}
											width={1080}
											className="object-cover object-top w-full h-full"
										/>
									</div>
								</div>,
							);
						}
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
		<section className="w-full pb-3 pt-0 md:pt-3 lg:pt-[3vh]">
			<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
				<HeroCarousel
					slides={carouselData}
					options={OPTIONS}
					useSocials={true}
				></HeroCarousel>
			</div>
		</section>
	);
}
