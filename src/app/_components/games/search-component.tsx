'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from './search-input';

interface AnimeItem {
	id: string;
	nameEn: string;
	nameJp: string;
}

type AnimeDataRaw = Record<string, string>;

export default function AnimeSearch() {
	const router = useRouter();
	const [combinedData, setCombinedData] = useState<AnimeItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch and Merge Data from both sources
	useEffect(() => {
		const loadAnimeData = async (): Promise<void> => {
			try {
				setLoading(true);
				setError(null);
				const [resEn, resJp] = await Promise.all([
					fetch('/indexes_en.json'),
					fetch('/indexes_jp.json'),
				]);

				if (!resEn.ok || !resJp.ok) {
					throw new Error('Failed to load anime data');
				}

				const dataEn = (await resEn.json()) as AnimeDataRaw;
				const dataJp = (await resJp.json()) as AnimeDataRaw;

				// Create a unique list of all IDs present in either file
				const allIds = Array.from(
					new Set([...Object.keys(dataEn), ...Object.keys(dataJp)]),
				);

				const merged: AnimeItem[] = allIds.map((id) => {
					const enName = dataEn[id];
					const jpName = dataJp[id];

					return {
						id,
						// Fallback logic: if EN is missing, use JP. If both missing, empty string.
						nameEn: enName ?? jpName ?? '',
						nameJp: jpName ?? enName ?? '',
					};
				});

				setCombinedData(merged);
			} catch (err) {
				console.error('Failed to load anime data:', err);
				setError('Failed to load anime data. Please refresh the page.');
			} finally {
				setLoading(false);
			}
		};
		void loadAnimeData();
	}, []);

	const handleSelect = (anime: AnimeItem): void => {
		const params = new URLSearchParams();
		params.set('animeId', anime.id);
		router.push(`?${params.toString()}`);
	};

	return (
		<SearchInput
			items={combinedData}
			searchKeys={[
				{ name: 'nameEn', weight: 0.7 },
				{ name: 'nameJp', weight: 0.3 },
			]}
			onSelect={handleSelect}
			placeholder="Search anime (English or Japanese)..."
			loading={loading}
			error={error}
			getItemId={(item) => item.id}
			renderItem={(anime) => (
				<>
					<div className="font-bold text-gray-900 truncate">
						{anime.nameEn}
					</div>
					{anime.nameJp !== anime.nameEn && (
						<div className="text-sm font-medium text-gray-400 italic truncate">
							{anime.nameJp}
						</div>
					)}
					<div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
						ID: {anime.id}
					</div>
				</>
			)}
		/>
	);
}
