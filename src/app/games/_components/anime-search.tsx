'use client';

import { useState, useEffect } from 'react';
import SearchInput from './search-input';

interface AnimeItem {
	id: string;
	nameEn: string;
	nameJp: string;
}

type AnimeDataRaw = Record<string, string>;

export interface AnimeSelection {
	id: string;
	title: string;
}

interface AnimeSearchProps {
	onSelect: (selection: AnimeSelection) => void;
	disabled?: boolean;
}

export default function AnimeSearch({ onSelect, disabled }: AnimeSearchProps) {
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
		onSelect({
			id: anime.id,
			title: anime.nameEn,
		});
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
			disabled={disabled}
			loading={loading}
			error={error}
			getItemId={(item) => item.id}
			renderItem={(anime) => (
				<div className="space-y-1">
					<div className="text-sm font-semibold text-gray-900 truncate">
						{anime.nameEn}
					</div>
					{anime.nameJp !== anime.nameEn && (
						<div className="text-xs text-gray-500 truncate">
							{anime.nameJp}
						</div>
					)}
				</div>
			)}
		/>
	);
}
