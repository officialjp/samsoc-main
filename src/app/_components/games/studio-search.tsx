'use client';

import { useState, useMemo, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import Fuse from 'fuse.js';
import { Search } from 'lucide-react';
import { api } from '~/trpc/react';

interface StudioItem {
	id: string; // This is the studio name string
	name: string;
}

interface StudioSearchProps {
	onSelect: (studioId: string) => void;
	disabled?: boolean;
}

export default function StudioSearch({
	onSelect,
	disabled,
}: StudioSearchProps) {
	const [input, setInput] = useState<string>('');
	const [results, setResults] = useState<StudioItem[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	// Fetch unique studios from our refactored tRPC call
	const { data: studioData } = api.studio.getAllStudios.useQuery();

	const fuse = useMemo((): Fuse<StudioItem> | null => {
		if (!studioData) return null;
		return new Fuse(studioData, {
			keys: ['name'],
			threshold: 0.3,
			minMatchCharLength: 2,
		});
	}, [studioData]);

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

	const handleSelect = (studio: StudioItem): void => {
		onSelect(studio.id); // Passes the studio name string up
		setInput('');
		setResults([]);
		setIsOpen(false);
	};

	return (
		<div className="flex justify-center items-center py-6">
			<div className="relative w-full max-w-2xl">
				<div className="relative">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
					<input
						type="text"
						value={input}
						onChange={handleInputChange}
						disabled={disabled}
						placeholder={
							disabled
								? 'Game Over'
								: 'Search for a studio (e.g. Mappa, Madhouse)...'
						}
						className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-2 border-black font-semibold text-base focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</div>
				{isOpen && results.length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-3 z-50 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
						{results.map((studio: StudioItem, index) => (
							<button
								key={studio.id}
								onClick={() => handleSelect(studio)}
								className={`w-full text-left px-5 py-4 font-semibold text-base transition-all hover:bg-gray-100 active:bg-gray-200 ${
									index !== results.length - 1
										? 'border-b-2 border-gray-200'
										: ''
								}`}
							>
								<div className="font-bold text-gray-900">
									{studio.name}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
