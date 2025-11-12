'use client';
import Image from 'next/image';
import { cn } from '~/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';

interface AnimeCardData {
	id: number;
	title: string;
	episode: string;
	source: string;
	mal_link: string;
	total_episodes: number;
	show_type: string;
	studio: string;
	genres: { id: number; name: string }[];
}

interface AnimeListProps {
	animes: AnimeCardData[];
}

export function AnimeCard(animes: AnimeListProps) {
	const positions = ['left-card', 'center-card', 'right-card'];
	return (
		<div className="relative overflow-hidden flex items-center justify-center w-full h-[min(600px,90vw)]">
			{animes.animes?.map((anime, index) => {
				const clickHandler = (
					event: React.MouseEvent<HTMLDivElement>,
				) => {
					if (
						!event.currentTarget.classList.contains('center-card')
					) {
						event.preventDefault();

						const childArray = event.currentTarget.parentNode
							? Array.from(
									event.currentTarget.parentNode.children,
								)
							: [];

						childArray.forEach((child) => {
							const classes = child.classList;
							classes.remove('right-card');
							classes.remove('left-card');
							classes.remove('center-card');
						});

						event.currentTarget.classList.add('center-card');

						const flags = {
							left: false,
							center: false,
							right: false,
						};

						for (const child of childArray) {
							if (child.classList.contains('center-card')) {
								flags.center = true;
								continue;
							}

							if (!flags.left) {
								child.classList.add('left-card');
								flags.left = true;
								continue;
							}

							if (!flags.right) {
								child.classList.add('right-card');
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
								<Link
									href={anime.mal_link}
									className="block w-[min(40vw,320px)]"
								>
									<div className="relative w-full aspect-10/14">
										<Image
											draggable={false}
											alt={anime.title}
											src={anime.source}
											fill
											sizes="(max-width: 400px) 40vw, (max-width: 768px) 35vw, (max-width: 1024px) 25vw, 320px"
											quality={75}
											className="border-2 md:border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-black object-cover bg-black rounded-2xl"
										/>
									</div>
								</Link>
								<Link href={anime.mal_link}>
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
											{anime.show_type} •{' '}
											{anime.total_episodes} episodes
										</p>
									</div>
									<div className="flex flex-row gap-2 pb-2 pt-1">
										{anime.genres.map((tag) => (
											<p
												key={tag.name}
												className="bg-about1 rounded-xl pl-2 pr-2 p-1 text-black text-center"
											>
												{tag.name.toLowerCase()}
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
	);
}
