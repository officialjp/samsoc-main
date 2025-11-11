'use client';

import { useState, useEffect, useMemo } from 'react';
import MangaCard from '~/app/_components/library/manga-card';
import { LibraryFilters } from '~/app/_components/library/library-filters';
import { Pagination } from '~/app/_components/pagination';
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

const ITEMS_PER_PAGE = 12;

interface LibrarySearchProps {
	initialMangaData: MangaData[];
	allGenres: string[];
}

export function LibrarySearch({
	initialMangaData,
	allGenres,
}: LibrarySearchProps) {
	const [filters, setFilters] = useState({
		status: 'all',
		genre: 'all',
		search: '',
	});
	const [currentPage, setCurrentPage] = useState(1);

	const filteredManga = useMemo(() => {
		return initialMangaData.filter((manga) => {
			const isBorrowed =
				!!manga.borrowed_by && manga.borrowed_by !== 'NULL';

			if (filters.status === 'available' && isBorrowed) return false;
			if (filters.status === 'borrowed' && !isBorrowed) return false;

			if (
				filters.genre !== 'all' &&
				!manga.genres.includes(filters.genre)
			)
				return false;

			if (filters.search) {
				const searchTerm = filters.search.toLowerCase();
				return (
					manga.title.toLowerCase().includes(searchTerm) ||
					manga.author.toLowerCase().includes(searchTerm)
				);
			}
			return true;
		});
	}, [filters, initialMangaData]);

	const totalPages = Math.ceil(filteredManga.length / ITEMS_PER_PAGE);
	const paginatedManga = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredManga.slice(startIndex, endIndex);
	}, [filteredManga, currentPage]);

	useEffect(() => {
		setCurrentPage(1);
	}, [filters]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
			<div className="lg:sticky lg:top-24 h-fit">
				<LibraryFilters
					genres={allGenres}
					onFilterChange={setFilters}
					initialFilters={filters}
				/>
				<div className="mt-6 bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<h3 className="text-lg font-bold mb-2 flex items-center">
						<BookOpen className="h-5 w-5 mr-2" /> Library Rules
					</h3>
					<ul className="text-sm space-y-2">
						<li>• Paid members only</li>
						<li>• Only one manga borrowed per person at a time</li>
						<li>• Academic year borrowing period</li>
						<li>• No late fees</li>
					</ul>
				</div>
			</div>

			<div id="manga-results" className="lg:col-span-1">
				{filteredManga.length > 0 ? (
					<>
						<div className="mb-4 text-sm text-gray-500">
							Showing {paginatedManga.length} of{' '}
							{filteredManga.length} results
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
							{paginatedManga.map((manga) => (
								<MangaCard
									key={manga.id}
									title={manga.title}
									author={manga.author}
									volume={manga.volume}
									coverImage={manga.source}
									genre={manga.genres}
									isAvailable={
										!manga.borrowed_by ||
										manga.borrowed_by === 'NULL'
									}
									borrowedBy={manga.borrowed_by ?? undefined}
								/>
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
					<div className="bg-white border-2 border-black p-8 rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						<h3 className="text-xl font-bold mb-2">
							No manga found
						</h3>
						<p>Try adjusting your filters to see more results.</p>
					</div>
				)}
			</div>
		</div>
	);
}
