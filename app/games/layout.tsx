import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'SAMsoc Games',
	description: 'Website for the anime society in the University of Surrey',
	openGraph: {
		title: 'Surrey Anime and Manga Society',
		description:
			'Website for the anime society in the University of Surrey',
	},
	twitter: {
		card: 'summary',
		title: 'Surrey Anime and Manga Society',
		description:
			'Website for the anime society in the University of Surrey',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div>{children}</div>;
}
