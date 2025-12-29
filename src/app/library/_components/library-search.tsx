'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { captureEvent } from '~/lib/posthog-client';
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
	currentPage: number;
	totalPages: number;
	totalCount: number;
	initialFilters: FilterState;
}

export function LibrarySearch({
	initialMangaData,
	allGenres,
	currentPage,
	totalPages,
	totalCount,
	initialFilters,
}: LibrarySearchProps) {
	const router = useRouter();
	const [filters, setFilters] = useState<FilterState>(initialFilters);

	const updateSearchParams = (newFilters: FilterState, newPage = 1) => {
		const params = new URLSearchParams();

		if (newPage > 1) {
			params.set('page', newPage.toString());
		}

		if (newFilters.status !== 'all') {
			params.set('status', newFilters.status);
		}

		if (newFilters.genre !== 'all') {
			params.set('genre', newFilters.genre);
		}

		if (newFilters.search) {
			params.set('search', newFilters.search);
		}

		const queryString = params.toString();
		const url = queryString ? `/library?${queryString}` : '/library';

		router.push(url, { scroll: false });
	};

	const handleFilterChange = (newFilters: FilterState) => {
		setFilters(newFilters);
		updateSearchParams(newFilters, 1);

		captureEvent('library_searched', {
			search_query: newFilters.search || null,
			status_filter: newFilters.status,
			genre_filter: newFilters.genre,
		});
	};

	const handlePageChange = (page: number) => {
		updateSearchParams(filters, page);
		document.getElementById('manga-results')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	const itemsPerPage = 12;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + initialMangaData.length;

	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
			<aside className="h-fit lg:sticky lg:top-24">
				<LibraryFilters
					genres={allGenres}
					onFilterChange={handleFilterChange}
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
				{initialMangaData.length > 0 ? (
					<>
						<p className="mb-4 text-sm text-gray-500">
							Showing{' '}
							{totalCount > 0
								? `${startIndex + 1}-${Math.min(endIndex, totalCount)}`
								: '0'}{' '}
							of {totalCount} results
						</p>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
							{initialMangaData.map((manga) => (
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
