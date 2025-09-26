'use client';

import supabase from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { CalendarDays } from 'lucide-react';

interface GenreType {
	genre: string;
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
					.select(
						'id, title, public_url, episode, description, mal, total_episodes, type_of_show, studio, genre (genre)',
					);
				if (animes) {
					setAnimes(animes as AnimeType[]);
				}
			} catch (err: any) {
				console.error(err.message);
			}
		}

		fetchAnimeData();
	}, []);

	const positions = ['left-card', 'center-card', 'right-card'];
	return (
		<>
			<div className="relative overflow-hidden flex items-center justify-center w-full h-[min(600px,90vw)] SAManim SAMfade-rotate SAMduration-800 SAMdelay-1000 SAMbounce">
				{animes &&
					animes.map((anime, index) => {
						const clickHandler = (
							event: React.MouseEvent<HTMLDivElement>,
						) => {
							if (
								!event.currentTarget.classList.contains(
									'center-card',
								)
							) {
								event.preventDefault();

								const childArray = event.currentTarget
									.parentNode
									? Array.from(
											event.currentTarget.parentNode
												.children,
										)
									: [];

								childArray.forEach((child) => {
									const classes = child.classList;
									classes.remove('right-card');
									classes.remove('left-card');
									classes.remove('center-card');
								});

								event.currentTarget.classList.add(
									'center-card',
								);

								const flags = {
									left: false,
									center: false,
									right: false,
								};

								console.log(flags);

								for (let i = 0; i < childArray.length; i++) {
									if (
										childArray[i].classList.contains(
											'center-card',
										)
									) {
										flags.center = true;
										continue;
									}

									if (!flags.left) {
										childArray[i].classList.add(
											'left-card',
										);
										flags.left = true;
										continue;
									}

									if (!flags.right) {
										childArray[i].classList.add(
											'right-card',
										);
										flags.right = true;
										continue;
									}
								}
							}
						};

						return (
							<div
								key={anime.id}
								onClick={(event) => clickHandler(event)}
								className={cn(
									'card-bottom absolute w-fit',
									positions[index],
								)}
							>
								<Tooltip>
									<TooltipTrigger>
										<Link href={anime.mal}>
											<Image
												draggable={false}
												alt={anime.title}
												src={anime.public_url}
												width={320}
												height={452}
												className="border-2 md:border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-black aspect-[7/10] w-[min(40vw,320px)] bg-black rounded-2xl"
											></Image>
										</Link>
										<Link href={anime.mal}>
											<p className="hover:text-button2 py-4 text-sm md:text-xl font-bold">
												{anime.title}
											</p>
										</Link>
									</TooltipTrigger>
									<TooltipContent>
										<div className="pr-5">
											<p className="text-2xl">
												Episode: {anime.episode}
											</p>
											<div className="pt-2">
												<p className="text-sm text-about2">
													{anime.studio}
												</p>
												<p className="text-gray-300 pt-0 mt-0 text-lg">
													{anime.type_of_show} •{' '}
													{anime.total_episodes}{' '}
													episodes
												</p>
											</div>
											<div className="flex flex-row gap-2 pb-2 pt-1">
												{anime.genre.map((tag) => (
													<p
														key={tag.genre}
														className="bg-about1 rounded-xl pl-2 pr-2 p-1 text-black text-center"
													>
														{tag.genre.toLowerCase()}
													</p>
												))}
											</div>
										</div>
									</TooltipContent>
								</Tooltip>
							</div>
						);
					})}
			</div>
			<div className="mb-8 -mt-8 text-center SAManim SAMfade-in SAMduration-700 SAMdelay-1200">
				<p className="font-medium mb-4">
					Don't worry if you've missed previous episodes - you have
					plenty of time to catch-up!
				</p>
				<Button
					asChild
					className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
				>
					<Link href="/calendar" className="flex items-center">
						<CalendarDays className="mr-2 h-4 w-4" />
						View Full Calendar
					</Link>
				</Button>
			</div>
		</>
	);
}
