import '~/styles/globals.css';
import { type Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { Footer } from '~/components/layout/footer';
import { Header } from '~/components/layout/header';
import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '~/components/shared/error-boundary';

export const metadata: Metadata = {
	title: 'Surrey Anime and Manga Society - Join Our Community',
	description:
		'Join the Surrey Anime and Manga Society at University of Surrey! Discover weekly screenings, exciting events, and interactive games.',
	openGraph: {
		title: 'Surrey Anime and Manga Society - Join Our Community',
		description:
			'Join the Surrey Anime and Manga Society at University of Surrey! Discover weekly screenings, exciting events, interactive games, and connect with fellow anime enthusiasts.',
		images: [
			{
				url: '/opengraph-image',
				width: 1200,
				height: 630,
				alt: 'Surrey Anime and Manga Society - Join Our Community',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Surrey Anime and Manga Society - Join Our Community',
		description:
			'Join the Surrey Anime and Manga Society at University of Surrey! Discover weekly screenings, exciting events, interactive games, and connect with fellow anime enthusiasts.',
		images: ['/opengraph-image'],
	},
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
	},
};

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	display: 'swap',
	preload: true,
	adjustFontFallback: true,
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	display: 'swap',
	preload: false,
	adjustFontFallback: true,
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
				<ErrorBoundary>
					<div className="pt-20">
						<Header />
						<Suspense>
							<TRPCReactProvider>{children}</TRPCReactProvider>
						</Suspense>
						<Footer />
					</div>
					<Toaster position="bottom-right" richColors closeButton />
				</ErrorBoundary>
			</body>
		</html>
	);
}
