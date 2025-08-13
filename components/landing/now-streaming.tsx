import { AnimeCard } from '@/components/landing/anime-card';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { isMobile } from 'react-device-detect';
import supabase from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

interface AnimeType {
	id: number;
	title: string;
	episode: string;
	description: string;
	public_url: string;
	mal: string;
}

interface AnimeCardProps {
	data: AnimeType[] | null;
	error: PostgrestError | null;
}

export async function getStaticProps() {
	const { data }: AnimeCardProps = await supabase
		.from('regular')
		.select('title, public_url, episode, description, id, mal');

	return {
		props: { data },
		revalidate: 86400,
	};
}

export async function NowStreamingContent() {
	const { data: animes }: AnimeCardProps = await supabase
		.from('regular')
		.select('title, public_url, episode, description, id, mal');

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
