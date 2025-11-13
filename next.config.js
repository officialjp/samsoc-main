/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'xgufgalqtdiiaoeciaff.supabase.co',
				pathname: '/storage/v1/object/public/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net/**',
			},
			{
				protocol: 'https',
				hostname: 'heyitsmejp.com/**',
			},
		],
		formats: ['image/avif'],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 640],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
	},
};

export default config;
