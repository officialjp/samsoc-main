'use client';
import { AnimeCard } from '@/components/landing/anime-card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { isMobile } from 'react-device-detect';
import supabase from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useEffect, useState } from 'react';

interface GenreType {
	genre: string,
}

interface AnimeType {
	id: number;
	title: string;
	episode: string;
	description: string;
	public_url: string;
	mal: string;
	total_episodes: number;
	type_of_show: string;
	studio: string;
	genre: GenreType[];
}

interface AnimeCardProps {
	data: AnimeType[] | null;
	error: PostgrestError | null;
}

export function NowStreamingContent() {
	const [animes, setAnimes] = useState<AnimeType[] | null>(null);

	useEffect(() => {
		async function fetchAnimeData() {
			try {
				const { data: animes }: AnimeCardProps = await supabase
					.from('regular')
					.select('title, public_url, episode, description, id, mal, total_episodes, type_of_show, studio, genre (genre)');
	
				if (animes) {
					setAnimes(animes as AnimeType[]);
				}
			} catch (err: any) {
				console.error(err.message);
			}
		}
	
		fetchAnimeData();
	}, []);

	if (!isMobile) {
		return (
		<div className='flex items-center flex-row gap-32 justify-center py-12 pb-8'>
			{animes && animes.map((anime) => (
				<div key={anime.id}>
						<Tooltip>
							<TooltipTrigger>
								<Link href={anime.mal}>
									<Image
									alt={anime.title}
									src={anime.public_url}
									width={320}
									height={452}
									className='border-2 md:border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-black max-h-[452px] max-w-[320px] '>
									</Image>
								</Link>
								<Link href={anime.mal}>
									<p className='hover:text-button2 py-4 text-xl font-bold'>{anime.title}</p>
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<div className='pr-5'>
									<p className='text-2xl'>Episode: {anime.episode}</p>
									<div className='pt-2'>
										<p className='text-sm text-about2'>{anime.studio}</p>
										<p className='text-gray-300 pt-0 mt-0 text-lg'>{anime.type_of_show} • {anime.total_episodes} episodes</p>
									</div>
									<div className='flex flex-row gap-2 pb-2 pt-1'>
										{anime.genre.map((tag) => (
											<p key={tag.genre} className='bg-about1 rounded-xl pl-2 pr-2 p-1 text-black text-center'>{tag.genre.toLowerCase()}</p>
										))}
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
				</div>
				))}
			</div>
		)	
	} else {
		return (
			<div className="mx-0 m-w-screen w-screen gap-8 py-12 -ml-4 md:-ml-6 lg:-ml-8">
				<div className="mx-0 w-screen gap-6 flex justify-center items-center">
					<Carousel className="w-full">
						<CarouselContent>
							{animes &&
								animes.map((anime) => (
									<CarouselItem key={anime.id}>
										<div className="p-[16px] h-full">
											<div className="relative flex items-center h-full">
												<AnimeCard
													title={anime.title}
													episode={anime.episode}
													description={anime.description}
													image={anime.public_url}
													url={anime.mal}
												/>
											</div>
										</div>
									</CarouselItem>
								))}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		);
	}
}
