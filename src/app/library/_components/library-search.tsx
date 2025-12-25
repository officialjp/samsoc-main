'use client';

import { useState, useEffect } from 'react';
import MangaCard from './manga-card';
import LibraryFilters from './library-filters';
import { Pagination } from '~/components/shared/pagination';
import { BookOpen } from 'lucide-react';

interface MangaData {
	id: number;
	title: string;
	source: string;
	author: string;
	borrowed_by: string | null;
	volume: number;
	genres: string[];
}

interface FilterState {
	status: string;
	genre: string;
	search: string;
}

interface LibrarySearchProps {
	initialMangaData: MangaData[];
	allGenres: readonly string[];
}

const ITEMS_PER_PAGE = 12;

export function LibrarySearch({
	initialMangaData,
	allGenres,
}: LibrarySearchProps) {
	const [filters, setFilters] = useState<FilterState>({
		status: 'all',
		genre: 'all',
		search: '',
	});
	const [currentPage, setCurrentPage] = useState(1);

	const filteredManga = initialMangaData.filter((manga) => {
		if (filters.status !== 'all') {
			const isBorrowed =
				!!manga.borrowed_by && manga.borrowed_by !== 'NULL';
			if (filters.status === 'available' && isBorrowed) return false;
			if (filters.status === 'borrowed' && !isBorrowed) return false;
		}

		if (filters.genre !== 'all' && !manga.genres.includes(filters.genre)) {
			return false;
		}

		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			return (
				manga.title.toLowerCase().includes(searchLower) ||
				manga.author.toLowerCase().includes(searchLower)
			);
		}

		return true;
	});

	const totalPages = Math.ceil(filteredManga.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedManga = filteredManga.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE,
	);

	useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		document.getElementById('manga-results')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
			<aside className="h-fit lg:sticky lg:top-24">
				<LibraryFilters
					genres={allGenres}
					onFilterChange={setFilters}
					filters={filters}
				/>
				<div className="mt-6 rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<h3 className="mb-2 flex items-center text-lg font-bold">
						<BookOpen className="mr-2 h-5 w-5" /> Library Rules
					</h3>
					<ul className="space-y-2 text-sm">
						<li>• Paid members only</li>
						<li>• Only one manga borrowed per person at a time</li>
						<li>• Academic year borrowing period</li>
						<li>• No late fees</li>
					</ul>
				</div>
			</aside>

			<section id="manga-results">
				{filteredManga.length > 0 ? (
					<>
						<p className="mb-4 text-sm text-gray-500">
							Showing {paginatedManga.length} of{' '}
							{filteredManga.length} results
						</p>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
							{paginatedManga.map((manga) => (
								<MangaCard key={manga.id} manga={manga} />
							))}
						</div>

						{totalPages > 1 && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						)}
					</>
				) : (
					<div className="rounded-2xl border-2 border-black bg-white p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						<h3 className="mb-2 text-xl font-bold">
							No manga found
						</h3>
						<p className="text-gray-600">
							Try adjusting your filters to see more results.
						</p>
					</div>
				)}
			</section>
		</div>
	);
}
