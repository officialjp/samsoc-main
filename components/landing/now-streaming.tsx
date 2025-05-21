'use client';
import { useState, useEffect } from 'react';
import { AnimeCard } from '@/components/landing/anime-card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import useIsMobile from '../mobile-check';
import { createClient } from '@/utils/supabase/client';

interface AnimeType {
	id: number;
	title: string;
	episode: string;
	description: string;
	public_url: string;
}

export function NowStreamingContent() {
	const [animes, setAnimes] = useState<AnimeType[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		const fetchRegularAnime = async () => {
			try {
				setLoading(true);
				setError(null);
				const supabase = createClient();

				const { data: regularData, error: fetchError } = await supabase
					.from('regular')
					.select('title, public_url, episode, description, id');

				if (fetchError) {
					setError(
						`Error fetching streaming anime: ${fetchError.message}`,
					);
					return;
				}

				setAnimes(regularData as AnimeType[]);
			} catch (err: any) {
				setError(`An unexpected error occurred: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchRegularAnime();
	}, []);

	if (loading) {
		return (
			<div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
				<h3 className="text-xl font-bold mb-2">
					Loading this week's anime...
				</h3>
				<p>Please wait while we gather the schedule.</p>
			</div>
		);
	}

	if (error) {
		return <div>Error loading streaming anime: {error}</div>;
	}

	if (isMobile) {
		return (
			<div className="mx-auto max-w-7xl gap-8 py-12 ">
				<div className="mx-auto max-w-7xl gap-6 flex justify-center items-center">
					<Carousel className="w-full lg:max-w-[500]">
						<CarouselContent>
							{animes.map((anime) => (
								<CarouselItem key={anime.id}>
									<div className="p-[10px]">
										<div className="relative flex items-center">
											<AnimeCard
												title={anime.title}
												episode={anime.episode}
												description={anime.description}
												image={anime.public_url}
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
	return (
		<div className="container w-full max-w-full py-8 px-8">
			<div className="relative mx-auto max-w-7xl p-4 ">
				<div className="grid gap-8 md:grid-cols-3">
					{animes.map((anime) => (
						<AnimeCard
							key={anime.id}
							title={anime.title}
							episode={anime.episode}
							description={anime.description}
							image={anime.public_url}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
