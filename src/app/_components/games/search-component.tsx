'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';

interface AnimeItem {
	id: string;
	nameEn: string;
	nameJp: string;
}

type AnimeDataRaw = Record<string, string>;

export default function AnimeSearch() {
	const router = useRouter();
	const [input, setInput] = useState<string>('');
	const [results, setResults] = useState<AnimeItem[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [combinedData, setCombinedData] = useState<AnimeItem[]>([]);

	// 1. Fetch and Merge Data from both sources
	useEffect(() => {
		const loadAnimeData = async (): Promise<void> => {
			try {
				const [resEn, resJp] = await Promise.all([
					fetch('/indexes_en.json'),
					fetch('/indexes_jp.json'),
				]);

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
			} catch (error) {
				console.error('Failed to load anime data:', error);
			}
		};
		void loadAnimeData();
	}, []);

	// 2. Initialize Fuse with multi-key support
	const fuse = useMemo((): Fuse<AnimeItem> | null => {
		if (combinedData.length === 0) return null;

		return new Fuse(combinedData, {
			keys: [
				{ name: 'nameEn', weight: 0.7 },
				{ name: 'nameJp', weight: 0.3 },
			],
			threshold: 0.3,
			minMatchCharLength: 2,
		});
	}, [combinedData]);

	// 3. Search logic with debouncing
	useEffect(() => {
		if (!input.trim() || !fuse) {
			setResults([]);
			setIsOpen(false);
			return;
		}

		const timer = setTimeout(() => {
			const searchResults = fuse.search(input);
			setResults(searchResults.map((result) => result.item).slice(0, 5));
			setIsOpen(true);
		}, 200);

		return () => clearTimeout(timer);
	}, [input, fuse]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setInput(e.target.value);
	};

	const handleSelect = (anime: AnimeItem): void => {
		const params = new URLSearchParams();
		params.set('animeId', anime.id);
		router.push(`?${params.toString()}`);
		setInput('');
		setResults([]);
		setIsOpen(false);
	};

	return (
		<div className="flex justify-center items-center py-12">
			<div className="relative w-full max-w-2xl px-4">
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
					<input
						type="text"
						value={input}
						onChange={handleInputChange}
						placeholder="Search anime (English or Japanese)..."
						className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-2 border-black font-semibold text-base focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
					/>
				</div>

				{isOpen && results.length > 0 && (
					<div className="absolute top-full left-4 right-4 mt-3 z-50 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
						{results.map((anime, index) => (
							<button
								key={anime.id}
								onClick={() => handleSelect(anime)}
								className={`w-full text-left px-5 py-4 font-semibold text-base transition-all hover:bg-gray-100 active:bg-gray-200 ${
									index !== results.length - 1
										? 'border-b-2 border-gray-200'
										: ''
								}`}
							>
								<div className="font-bold text-gray-900 truncate">
									{anime.nameEn}
								</div>
								{/* Only show the Japanese name if it's different from the English one */}
								{anime.nameJp !== anime.nameEn && (
									<div className="text-sm font-medium text-gray-400 italic truncate">
										{anime.nameJp}
									</div>
								)}
								<div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
									ID: {anime.id}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
