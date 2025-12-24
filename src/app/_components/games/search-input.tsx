'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import { Search, Loader2 } from 'lucide-react';

interface SearchInputProps<T> {
	items: T[];
	searchKeys: Array<{ name: keyof T; weight?: number }>;
	onSelect: (item: T) => void;
	placeholder?: string;
	disabled?: boolean;
	renderItem: (item: T) => React.ReactNode;
	getItemId: (item: T) => string;
	loading?: boolean;
	error?: string | null;
	debounceMs?: number;
	threshold?: number;
	minMatchCharLength?: number;
	maxResults?: number;
}

export default function SearchInput<T extends Record<string, unknown>>({
	items,
	searchKeys,
	onSelect,
	placeholder = 'Search...',
	disabled = false,
	renderItem,
	getItemId,
	loading = false,
	error = null,
	debounceMs = 200,
	threshold = 0.3,
	minMatchCharLength = 2,
	maxResults = 5,
}: SearchInputProps<T>) {
	const [input, setInput] = useState<string>('');
	const [results, setResults] = useState<T[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [focusedIndex, setFocusedIndex] = useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);

	const fuse = useMemo((): Fuse<T> | null => {
		if (items.length === 0) return null;

		return new Fuse(items, {
			keys: searchKeys.map((key) => ({
				name: String(key.name),
				weight: key.weight ?? 1,
			})),
			threshold,
			minMatchCharLength,
		});
	}, [items, searchKeys, threshold, minMatchCharLength]);

	// Search logic with debouncing
	useEffect(() => {
		if (!input.trim() || !fuse) {
			setResults([]);
			setIsOpen(false);
			setFocusedIndex(-1);
			return;
		}

		const timer = setTimeout(() => {
			const searchResults = fuse.search(input);
			setResults(searchResults.map((result) => result.item).slice(0, maxResults));
			setIsOpen(true);
			setFocusedIndex(-1);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [input, fuse, debounceMs, maxResults]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setInput(e.target.value);
	};

	const handleSelect = (item: T): void => {
		onSelect(item);
		setInput('');
		setResults([]);
		setIsOpen(false);
		setFocusedIndex(-1);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (!isOpen || results.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setFocusedIndex((prev) =>
					prev < results.length - 1 ? prev + 1 : prev,
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (focusedIndex >= 0 && focusedIndex < results.length) {
					handleSelect(results[focusedIndex]!);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				setFocusedIndex(-1);
				inputRef.current?.blur();
				break;
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				resultsRef.current &&
				!resultsRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setFocusedIndex(-1);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="flex justify-center items-center py-6">
			<div className="relative w-full max-w-2xl">
				<div className="relative">
					{loading ? (
						<Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 animate-spin" />
					) : (
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
							aria-hidden="true"
						/>
					)}
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						disabled={disabled || loading}
						placeholder={disabled ? 'Game Over' : placeholder}
						aria-label={placeholder}
						aria-autocomplete="list"
						aria-expanded={isOpen}
						aria-controls="search-results"
						className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-2 border-black font-semibold text-base focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
				</div>

				{error && (
					<p className="mt-2 text-sm text-red-600" role="alert">
						{error}
					</p>
				)}

				{isOpen && results.length > 0 && (
					<div
						ref={resultsRef}
						id="search-results"
						className="absolute top-full left-0 right-0 mt-3 z-50 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
						role="listbox"
						aria-label="Search results"
					>
						{results.map((item, index) => (
							<button
								key={getItemId(item)}
								onClick={() => handleSelect(item)}
								role="option"
								aria-selected={index === focusedIndex}
								className={`w-full text-left px-5 py-4 font-semibold text-base transition-all hover:bg-gray-100 active:bg-gray-200 ${
									index === focusedIndex ? 'bg-gray-100' : ''
								} ${
									index !== results.length - 1
										? 'border-b-2 border-gray-200'
										: ''
								}`}
							>
								{renderItem(item)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

