/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
	reactCompiler: true,
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net',
			},
			{
				protocol: 'https',
				hostname: 'heyitsmejp.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
			},
		],
		formats: ['image/avif'],
		imageSizes: [16, 32, 64, 128, 256, 640],
		deviceSizes: [640, 750, 828, 1080, 1200],
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// PostHog reverse proxy configuration
	async rewrites() {
		return [
			{
				source: '/ingest/static/:path*',
				destination: 'https://eu-assets.i.posthog.com/static/:path*',
			},
			{
				source: '/ingest/:path*',
				destination: 'https://eu.i.posthog.com/:path*',
			},
		];
	},
	// Required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
	async headers() {
		return [
			{
				source: '/dashboard/stats/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: "frame-src 'self' https://eu.posthog.com;",
					},
				],
			},
		];
	},
};

export default config;
