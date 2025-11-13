'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { cn } from '~/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface Genre {
	id: number;
	name: string;
}

interface AnimeCardData {
	id: number;
	title: string;
	episode: string;
	source: string;
	mal_link: string;
	total_episodes: number;
	show_type: string;
	studio: string;
	genres: Genre[];
}

interface AnimeCardProps {
	animes: AnimeCardData[];
}

const CARD_POSITIONS = ['left-card', 'center-card', 'right-card'] as const;

export function AnimeCard({ animes }: AnimeCardProps) {
	const [selectedId, setSelectedId] = useState<number | null>(
		animes[1]?.id ?? null,
	);

	const positions = useMemo(() => CARD_POSITIONS, []);

	const handleCardClick = useCallback(
		(event: React.SyntheticEvent<HTMLDivElement>, animeId: number) => {
			const target = event.currentTarget;

			if (target.classList.contains('center-card')) {
				return;
			}

			event.preventDefault();

			setSelectedId(animeId);

			const parent = target.parentNode;
			if (!parent) return;

			const siblings = Array.from(parent.children) as HTMLElement[];

			siblings.forEach((sibling) => {
				sibling.classList.remove(
					'right-card',
					'left-card',
					'center-card',
				);
			});

			target.classList.add('center-card');

			let leftAssigned = false;
			let rightAssigned = false;

			for (const sibling of siblings) {
				if (sibling === target) continue;

				if (!leftAssigned) {
					sibling.classList.add('left-card');
					leftAssigned = true;
				} else if (!rightAssigned) {
					sibling.classList.add('right-card');
					rightAssigned = true;
				}
			}
		},
		[],
	);

	if (!animes?.length) {
		return null;
	}

	return (
		<div className="relative flex h-[min(600px,90vw)] w-full items-center justify-center overflow-hidden">
			{animes.map((anime, index) => (
				<AnimeCardItem
					key={anime.id}
					anime={anime}
					position={positions[index]!}
					isSelected={selectedId === anime.id}
					onClick={handleCardClick}
				/>
			))}
		</div>
	);
}
interface AnimeCardItemProps {
	anime: AnimeCardData;
	position: (typeof CARD_POSITIONS)[number];
	isSelected: boolean;
	onClick: (
		event: React.SyntheticEvent<HTMLDivElement>,
		animeId: number,
	) => void;
}

function AnimeCardItem({
	anime,
	position,
	isSelected,
	onClick,
}: AnimeCardItemProps) {
	return (
		<div
			onClick={(e) => onClick(e, anime.id)}
			className={cn('card-bottom absolute w-fit', position)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick(e, anime.id);
				}
			}}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Link
							href={anime.mal_link}
							className="block w-[min(40vw,320px)]"
							aria-label={`View ${anime.title} on MyAnimeList`}
						>
							<div className="relative aspect-10/14 w-full">
								<Image
									draggable={false}
									alt={`${anime.title} cover image`}
									src={anime.source}
									fill
									sizes="(max-width: 400px) 40vw, (max-width: 768px) 35vw, (max-width: 1024px) 25vw, 320px"
									quality={75}
									loading="lazy"
									className="rounded-2xl border-2 border-black bg-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:border-2"
								/>
							</div>
						</Link>
						{isSelected && (
							<Link href={anime.mal_link} className="block">
								<p className="py-4 text-center text-sm font-bold hover:text-button2 md:text-xl">
									{anime.title}
								</p>
							</Link>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<div className="pr-5">
						<p className="text-2xl">Episode: {anime.episode}</p>
						<div className="pt-2">
							<p className="text-sm text-about2">
								{anime.studio}
							</p>
							<p className="mt-0 pt-0 text-lg text-gray-300">
								{anime.show_type} • {anime.total_episodes}{' '}
								episodes
							</p>
						</div>
						<div className="flex flex-row flex-wrap gap-2 pb-2 pt-1">
							{anime.genres.map((genre) => (
								<span
									key={genre.id}
									className="rounded-xl bg-about1 p-1 pl-2 pr-2 text-center text-black"
								>
									{genre.name.toLowerCase()}
								</span>
							))}
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
