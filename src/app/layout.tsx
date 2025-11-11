import '~/styles/globals.css';
import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Footer } from './_components/footer';
import { Header } from './_components/header';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society',
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

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-[-45deg,#fdcedf,#f8e8ee,#f9f5f6]`}
			>
				<div className="pt-20">
					<Header />
					<TRPCReactProvider>{children}</TRPCReactProvider>
					<Footer />
				</div>
			</body>
		</html>
	);
}
