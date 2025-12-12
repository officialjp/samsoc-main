'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

interface AnimeItem {
	id: string;
	name: string;
}

type AnimeData = Record<string, string>;

export default function AnimeSearch() {
	const router = useRouter();
	const [input, setInput] = useState<string>('');
	const [results, setResults] = useState<AnimeItem[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [animeData, setAnimeData] = useState<AnimeData | null>(null);

	// Initialize Fuse index when data loads
	const fuse = useMemo((): Fuse<AnimeItem> | null => {
		if (!animeData) return null;

		const entries: AnimeItem[] = Object.entries(animeData).map(
			([id, name]) => ({
				id,
				name,
			}),
		);

		return new Fuse(entries, {
			keys: ['name'],
			threshold: 0.3,
			minMatchCharLength: 2,
		});
	}, [animeData]);

	// Load anime data from public/indexes.json
	useEffect(() => {
		const loadAnimeData = async (): Promise<void> => {
			try {
				const response = await fetch('/indexes.json');
				const data = (await response.json()) as AnimeData;
				setAnimeData(data);
			} catch (error) {
				console.error('Failed to load anime data:', error);
			}
		};
		void loadAnimeData();
	}, []);

	useEffect(() => {
		if (!input || !fuse) {
			setResults([]);
			setIsOpen(false);
			return;
		}

		const timer: NodeJS.Timeout = setTimeout(() => {
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
		<div className="relative w-full max-w-md">
			<input
				type="text"
				value={input}
				onChange={handleInputChange}
				placeholder="Search anime..."
				className="w-full px-4 py-3 rounded-2xl bg-white text-black border-4 border-black font-bold text-sm focus:outline-none focus:ring-0 transition-shadow shadow-[2px_2px_0px_rgba(0,0,0,1)]"
			/>
			{isOpen && results.length > 0 && (
				<div className="absolute rounded-2xl top-full left-0 right-0 mt-2 z-50 bg-white border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
					{results.map((anime: AnimeItem, index) => (
						<button
							key={anime.id}
							onClick={() => handleSelect(anime)}
							className={`w-full text-left px-4 py-3 rounded-sm font-bold text-sm transition-all hover:bg-gray-300 hover:text-white active:translate-x-1 active:translate-y-1 ${
								index !== results.length - 1
									? 'border-b-4 border-black'
									: ''
							}`}
						>
							<div className="font-bold text-black">
								{anime.name}
							</div>
							<div className="text-xs font-semibold text-gray-600 mt-1">
								ID: {anime.id}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
