import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
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

export default nextConfig;
