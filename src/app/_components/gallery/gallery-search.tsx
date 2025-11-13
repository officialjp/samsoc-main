'use client';
import { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryFilter } from '~/app/_components/gallery/gallery-filter';
import { GalleryImage } from '~/app/_components/gallery/gallery-image';
import { Button } from '~/app/_components/ui/button';
import { Pagination } from '~/app/_components/pagination';
import { X } from 'lucide-react';
import type { Image } from 'generated/prisma';

interface GallerySearchProps {
	initialItems: Image[];
	currentPage: number;
	totalPages: number;
	totalImages: number;
}

const CATEGORIES = ['All', 'Events', 'Collaborations'] as const;
const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2022;

const generateYears = (): string[] => {
	const yearsCount = CURRENT_YEAR - START_YEAR + 1;
	return [
		'All',
		...Array.from({ length: yearsCount }, (_, i) => String(START_YEAR + i)),
	];
};

export function GallerySearch({
	initialItems,
	currentPage,
	totalPages,
	totalImages,
}: GallerySearchProps) {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState<string>('All');
	const [activeYear, setActiveYear] = useState<string>('All');

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

	const hasActiveFilters = activeCategory !== 'All' || activeYear !== 'All';

	const clearFilters = useCallback(() => {
		setActiveCategory('All');
		setActiveYear('All');
	}, []);

	const handlePageChange = useCallback(
		(newPage: number) => {
			router.push(`?page=${newPage}`);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		},
		[router],
	);

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
							onCategoryChange={setActiveCategory}
							onYearChange={setActiveYear}
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
								{filteredItems.length !== 1 ? 's' : ''} on this
								page
							</p>
							<p className="text-sm text-gray-600">
								{totalImages} total photos
							</p>
						</div>
					</div>
				</aside>

				<section>
					{filteredItems.length > 0 ? (
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
							{filteredItems.map((item) => (
								<GalleryImage
									key={item.id}
									src={item.source}
									alt={item.alt}
									thumbnailSrc={
										item.thumbnailSource ??
										'/placeholder.svg'
									}
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
