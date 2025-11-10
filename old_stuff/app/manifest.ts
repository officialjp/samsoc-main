import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Surrey Anime and Manga Society',
		short_name: 'SAMSoC',
		description:
			'Website for the anime society in the University of Surrey',
		start_url: '/',
		display: 'standalone',
	};
}
