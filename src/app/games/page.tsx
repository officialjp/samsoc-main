import Link from 'next/link';
import { SectionContainer } from '~/components/layout/section-container';
import { SectionHeading } from '~/components/layout/section-heading';
import ScrollAnimationWrapper from '~/components/shared/scroll-animation-wrapper';
import { Sparkles, Clapperboard, Search, type LucideIcon } from 'lucide-react';

const games: {
	id: string;
	title: string;
	description: string;
	icon: LucideIcon;
	color: string;
	href: string;
}[] = [
	{
		id: 'wordle',
		title: 'Anime Wordle',
		description: 'Guess the anime based on its attributes',
		icon: Sparkles,
		color: 'bg-pink-100',
		href: '/games/wordle',
	},
	{
		id: 'studio',
		title: 'Studio Guessr',
		description: 'Guess the anime studio based on its attributes',
		icon: Clapperboard,
		color: 'bg-blue-100',
		href: '/games/studio',
	},
	{
		id: 'banner',
		title: 'Zoomed-In Banner',
		description: 'Guess the anime from a zoomed-in image',
		icon: Search,
		color: 'bg-green-100',
		href: '/games/banner',
	},
];

export default function GamesPage() {
	return (
		<div>
			<SectionContainer>
				<ScrollAnimationWrapper variant="fadeInUp">
					<SectionHeading
						badge="PLAY"
						title="Games Hub"
						badgeColor="bg-purple-200"
						description="Choose a game to play"
					/>
				</ScrollAnimationWrapper>

				<div className="max-w-7xl mx-auto py-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{games.map((game, index) => (
							<ScrollAnimationWrapper
								key={game.id}
								variant="fadeInUp"
								delay={index * 100}
							>
								<Link href={game.href} className="group block">
									<article className="h-full border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
										<div
											className={`w-14 h-14 ${game.color} rounded-xl border-2 border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
										>
											<game.icon className="w-7 h-7 text-gray-900" />
										</div>
										<h2 className="text-xl font-bold text-gray-900 mb-2">
											{game.title}
										</h2>
										<p className="text-gray-600 text-sm leading-relaxed">
											{game.description}
										</p>
										<div className="mt-4 text-sm font-bold text-gray-900 group-hover:underline">
											Play Now &rarr;
										</div>
									</article>
								</Link>
							</ScrollAnimationWrapper>
						))}
					</div>
				</div>
			</SectionContainer>
		</div>
	);
}
