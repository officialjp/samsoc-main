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
	},
};

export default config;
