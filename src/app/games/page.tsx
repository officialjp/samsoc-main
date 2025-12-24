import Link from 'next/link';

export default function GamesPage() {
	const games = [
		{
			id: 'wordle',
			title: 'Anime Wordle',
			description: 'Guess the anime based on its attributes',
			emoji: '🌸',
			href: '/games/wordle',
		},
		{
			id: 'studio',
			title: 'Studio Guessr',
			description: 'Guess the anime studio based on its attributes',
			emoji: '🎬',
			href: '/games/studio',
		},
		{
			id: 'banner',
			title: 'Zoomed-In Banner',
			description: 'Guess the anime from a zoomed-in image',
			emoji: '🔍',
			href: '/games/banner',
		},
	];

	return (
		<main className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="mb-8">
				<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
					Games Hub
				</h1>
				<p className="text-lg text-gray-700">Choose a game to play</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{games.map((game) => (
					<Link key={game.id} href={game.href} className="group">
						<article className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
							<div className="text-5xl mb-4">{game.emoji}</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								{game.title}
							</h2>
							<p className="text-gray-700">{game.description}</p>
							<div className="mt-4 text-sm font-bold text-gray-900 group-hover:underline">
								Play Now →
							</div>
						</article>
					</Link>
				))}
			</div>
		</main>
	);
}
