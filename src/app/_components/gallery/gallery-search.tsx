'use client';
import { useMemo, useState, useCallback } from 'react';
import GalleryFilter from '~/app/_components/gallery/gallery-filter';
import GalleryImage from '~/app/_components/gallery/gallery-image';
import { Button } from '~/app/_components/ui/button';
import { Pagination } from '~/app/_components/pagination';
import { X } from 'lucide-react';

interface GalleryImageData {
	id: number;
	source: string;
	thumbnailSource: string | null;
	alt: string;
	category: string;
	year: number;
}

interface GallerySearchProps {
	initialItems: GalleryImageData[];
}

const CATEGORIES = ['All', 'Events', 'Collaborations'] as const;
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2022;
const ITEMS_PER_PAGE = 15;

const generateYears = (): string[] => {
	const yearsCount = CURRENT_YEAR - START_YEAR + 1;
	return [
		'All',
		...Array.from({ length: yearsCount }, (_, i) => String(START_YEAR + i)),
	];
};

export function GallerySearch({ initialItems }: GallerySearchProps) {
	const [activeCategory, setActiveCategory] = useState<string>('All');
	const [activeYear, setActiveYear] = useState<string>('All');
	const [currentPage, setCurrentPage] = useState(1);

	const years = useMemo(() => generateYears(), []);

	const filteredItems = useMemo(() => {
		if (activeCategory === 'All' && activeYear === 'All') {
			return initialItems;
		}

		return initialItems.filter((item) => {
			const categoryMatch =
				activeCategory === 'All' || item.category === activeCategory;
			const yearMatch =
				activeYear === 'All' || item.year === parseInt(activeYear);
			return categoryMatch && yearMatch;
		});
	}, [initialItems, activeCategory, activeYear]);

	const paginatedItems = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		return filteredItems.slice(startIndex, endIndex);
	}, [filteredItems, currentPage]);

	const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

	const hasActiveFilters = activeCategory !== 'All' || activeYear !== 'All';

	const clearFilters = useCallback(() => {
		setActiveCategory('All');
		setActiveYear('All');
		setCurrentPage(1);
	}, []);

	const handleCategoryChange = useCallback((category: string) => {
		setActiveCategory(category);
		setCurrentPage(1);
	}, []);

	const handleYearChange = useCallback((year: string) => {
		setActiveYear(year);
		setCurrentPage(1);
	}, []);

	const handlePageChange = useCallback((newPage: number) => {
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

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
							categories={CATEGORIES}
							years={years}
							onCategoryChange={handleCategoryChange}
							onYearChange={handleYearChange}
							activeCategory={activeCategory}
							activeYear={activeYear}
						/>

						<div className="mt-8 border-t-2 border-gray-200 pt-6">
							<p className="mb-2 text-sm text-gray-600">
								Currently showing:
							</p>
							<div className="flex flex-wrap gap-2">
								<span className="rounded-2xl border border-pink-300 bg-pink-100 px-2 py-1 text-sm">
									{activeCategory}
								</span>
								<span className="rounded-2xl border border-cyan-300 bg-cyan-100 px-2 py-1 text-sm">
									{activeYear}
								</span>
							</div>
							<p className="mt-4 text-sm font-medium text-gray-900">
								{filteredItems.length} photo
								{filteredItems.length !== 1 ? 's' : ''} found
							</p>
							<p className="text-sm text-gray-600">
								Page {currentPage} of {totalPages}
							</p>
						</div>
					</div>
				</aside>

				<section>
					{paginatedItems.length > 0 ? (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
							{paginatedItems.map((item) => (
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
