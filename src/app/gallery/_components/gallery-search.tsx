'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GalleryFilter from './gallery-filter';
import GalleryImage from './gallery-image';
import { Button } from '~/components/ui/button';
import { Pagination } from '~/components/shared/pagination';
import { X } from 'lucide-react';

interface GalleryImageData {
	id: number;
	source: string;
	thumbnailSource: string | null;
	alt: string;
	category: string;
	year: number;
}

interface FilterState {
	category: string;
	year: string;
}

interface GallerySearchProps {
	initialItems: GalleryImageData[];
	categories: readonly string[];
	years: readonly string[];
	currentPage: number;
	totalPages: number;
	totalCount: number;
	initialFilters: FilterState;
}

export function GallerySearch({
	initialItems,
	categories,
	years,
	currentPage,
	totalPages,
	totalCount,
	initialFilters,
}: GallerySearchProps) {
	const router = useRouter();
	const [filters, setFilters] = useState<FilterState>(initialFilters);

	const updateSearchParams = (newFilters: FilterState, newPage = 1) => {
		const params = new URLSearchParams();

		if (newPage > 1) {
			params.set('page', newPage.toString());
		}

		if (newFilters.category !== 'All') {
			params.set('category', newFilters.category);
		}

		if (newFilters.year !== 'All') {
			params.set('year', newFilters.year);
		}

		const queryString = params.toString();
		const url = queryString ? `/gallery?${queryString}` : '/gallery';

		router.push(url, { scroll: false });
	};

	const hasActiveFilters =
		filters.category !== 'All' || filters.year !== 'All';

	const clearFilters = () => {
		const newFilters = { category: 'All', year: 'All' };
		setFilters(newFilters);
		updateSearchParams(newFilters, 1);
	};

	const handleCategoryChange = (category: string) => {
		const newFilters = { ...filters, category };
		setFilters(newFilters);
		updateSearchParams(newFilters, 1);
	};

	const handleYearChange = (year: string) => {
		const newFilters = { ...filters, year };
		setFilters(newFilters);
		updateSearchParams(newFilters, 1);
	};

	const handlePageChange = (newPage: number) => {
		updateSearchParams(filters, newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const itemsPerPage = 15;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + initialItems.length;

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
				<aside className="h-fit lg:sticky lg:top-24">
					<div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-2xl font-bold">
								Filter Gallery
							</h2>
							{hasActiveFilters && (
								<Button
									variant="default"
									size="sm"
									onClick={clearFilters}
									className="hover:cursor-pointer"
									aria-label="Clear all filters"
								>
									<X className="mr-1 h-3 w-3" /> Clear
								</Button>
							)}
						</div>

						<GalleryFilter
							categories={categories}
							years={years}
							onCategoryChange={handleCategoryChange}
							onYearChange={handleYearChange}
							activeCategory={filters.category}
							activeYear={filters.year}
						/>

						<div className="mt-8 border-t-2 border-gray-200 pt-6">
							<p className="mb-2 text-sm text-gray-600">
								Currently showing:
							</p>
							<div className="flex flex-wrap gap-2">
								<span className="rounded-2xl border border-pink-300 bg-pink-100 px-2 py-1 text-sm">
									{filters.category}
								</span>
								<span className="rounded-2xl border border-cyan-300 bg-cyan-100 px-2 py-1 text-sm">
									{filters.year}
								</span>
							</div>
							<p className="mt-4 text-sm font-medium text-gray-900">
								{totalCount > 0
									? `${startIndex + 1}-${Math.min(endIndex, totalCount)}`
									: '0'}{' '}
								of {totalCount} photo
								{totalCount !== 1 ? 's' : ''}
							</p>
							<p className="text-sm text-gray-600">
								Page {currentPage} of {totalPages}
							</p>
						</div>
					</div>
				</aside>

				<section>
					{initialItems.length > 0 ? (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
							{initialItems.map((item) => (
								<GalleryImage
									key={item.id}
									src={item.source}
									alt={item.alt}
									thumbnailSrc={item.thumbnailSource}
								/>
							))}
						</div>
					) : (
						<div className="rounded-2xl border-2 border-black bg-yellow-100 p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<h3 className="mb-2 text-xl font-bold">
								No photos found
							</h3>
							<p className="text-gray-700">
								Try changing your filters to see more photos.
							</p>
						</div>
					)}
				</section>
			</div>

			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
