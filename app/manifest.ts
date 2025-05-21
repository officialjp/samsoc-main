import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Surrey Anime and Manga Society',
		short_name: 'SamSoc',
		description: 'Website for the anime society in the University of Surre',
		start_url: '/',
		display: 'standalone',
	};
}
