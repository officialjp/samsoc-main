import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Games',
	description:
		'Play daily anime guessing games! Test your knowledge with Anime Wordle, Studio Guesser, and Zoomed-In Banner.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Games',
		description:
			'Play daily anime guessing games! Test your knowledge with Anime Wordle, Studio Guesser, and Zoomed-In Banner.',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Surrey Anime and Manga Society - Games',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Surrey Anime and Manga Society - Games',
		description:
			'Play daily anime guessing games! Test your knowledge with Anime Wordle, Studio Guesser, and Zoomed-In Banner.',
		images: ['/opengraph-image'],
	},
};

export default function GamesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Prefetch JSON indexes for anime search to improve LCP/FCP */}
			<link
				rel="prefetch"
				href="/indexes_en.json"
				as="fetch"
				crossOrigin="anonymous"
			/>
			<link
				rel="prefetch"
				href="/indexes_jp.json"
				as="fetch"
				crossOrigin="anonymous"
			/>
			{children}
		</>
	);
}
