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

	// 1. Load both JSON files and merge them
	useEffect(() => {
		const loadAnimeData = async (): Promise<void> => {
			try {
				const [resEn, resJp] = await Promise.all([
					fetch('/indexes_en.json'),
					fetch('/indexes_jp.json'),
				]);

				const dataEn = (await resEn.json()) as AnimeDataRaw;
				const dataJp = (await resJp.json()) as AnimeDataRaw;

				// Merge by ID (assuming keys match in both files)
				const merged: AnimeItem[] = Object.keys(dataEn).map((id) => ({
					id,
					// Use the nullish coalescing operator (??) or OR (||) to provide a fallback
					nameEn: dataEn[id] ?? '',
					nameJp: dataJp[id] ?? '',
				}));

				setCombinedData(merged);
			} catch (error) {
				console.error('Failed to load anime data:', error);
			}
		};
		void loadAnimeData();
	}, []);

	// 2. Setup Fuse to search across both language keys
	const fuse = useMemo((): Fuse<AnimeItem> | null => {
		if (combinedData.length === 0) return null;

		return new Fuse(combinedData, {
			keys: ['nameEn', 'nameJp'],
			threshold: 0.3,
			minMatchCharLength: 2,
		});
	}, [combinedData]);

	// 3. Search logic
	useEffect(() => {
		if (!input || !fuse) {
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
						placeholder="Search in English or Japanese..."
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
								{/* Displaying both names for clarity */}
								<div className="font-bold text-gray-900">
									{anime.nameEn}
								</div>
								<div className="text-sm font-medium text-gray-400 italic">
									{anime.nameJp}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
