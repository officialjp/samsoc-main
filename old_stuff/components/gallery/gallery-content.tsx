'use client';
import { useEffect, useState } from 'react';
import { GalleryFilter } from '@/components/gallery/gallery-filter';
import { GalleryImage } from '@/components/gallery/gallery-image';
import supabase from '@/utils/supabase/client';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface GalleryItem {
	id: string;
	src: string;
	alt: string;
	category: string;
	year: string;
	public_url: string;
}

export default function GalleryContent() {
	const [galleryItems, setGalleryItems] = useState<GalleryItem[] | null>(
		null,
	);

	useEffect(() => {
		async function fetchGalleryData() {
			try {
				const { data } = await supabase.from('gallery').select('*');

				if (data) {
					setGalleryItems(data as GalleryItem[]);
				}
			} catch (e: unknown) {
				if (typeof e === 'string') {
					console.error('brokey');
				} else if (e instanceof Error) {
					console.error(e.message);
				}
			}
		}

		fetchGalleryData();
	}, []);

	const categories = ['All', 'Events', 'Collaborations'];
	const years = [
		'All',
		...Array(new Date().getFullYear() - 2021)
			.fill(0)
			.map((_, index) => {
				return (index + 2022).toString();
			}),
	];
	const [activeCategory, setActiveCategory] = useState<string>('All');
	const [activeYear, setActiveYear] = useState<string>('All');

	const filteredItems = galleryItems?.filter((item) => {
		const categoryMatch =
			activeCategory === 'All' || item.category === activeCategory;
		const yearMatch = activeYear === 'All' || item.year === activeYear;
		return categoryMatch && yearMatch;
	});

	const clearFilters = () => {
		setActiveCategory('All');
		setActiveYear('All');
	};

	const hasActiveFilters = activeCategory !== 'All' || activeYear !== 'All';

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
			<div className="lg:sticky lg:top-24 h-fit SAManim SAMfade-left SAMduration-700 SAMdelay-500 SAMbounce">
				<div className="border-2 rounded-2xl border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<h2 className="text-2xl font-bold mb-6">Filter Gallery</h2>
					<div className="flex justify-between items-center mb-6">
						{hasActiveFilters && (
							<Button
								variant="default"
								size="sm"
								onClick={clearFilters}
								className="hover:cursor-pointer "
							>
								<X className="h-3 w-3 mr-1" /> Clear Filters
							</Button>
						)}
					</div>

					<GalleryFilter
						categories={categories}
						years={years}
						onCategoryChange={setActiveCategory}
						onYearChange={setActiveYear}
						activeCategory={activeCategory}
						activeYear={activeYear}
					/>

					<div className="mt-8 pt-6 border-t-2 border-gray-200">
						<p className="text-sm text-gray-600 mb-2">
							Currently showing:
						</p>
						<div className="flex flex-wrap gap-2">
							<span className="bg-pink-100 px-2 py-1 text-sm border border-pink-300 rounded-2xl">
								{activeCategory}
							</span>
							<span className="bg-cyan-100 px-2 py-1 text-sm border border-cyan-300 rounded-2xl">
								{activeYear}
							</span>
						</div>
						<p className="mt-4 text-sm text-gray-600">
							{filteredItems?.length ?? 0} photo
							{(filteredItems?.length ?? 0) !== 1 ? 's' : ''}{' '}
							found
						</p>
					</div>
				</div>
			</div>

			<div className="SAManim SAMfade-up SAMduration-700 SAMdelay-500 SAMbounce">
				{filteredItems &&
					(filteredItems.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredItems.map((item) => (
								<GalleryImage
									key={item.id}
									src={item.public_url}
									alt={item.alt}
									width={600}
									height={400}
								/>
							))}
						</div>
					) : (
						<div className="border-2 border-black bg-yellow-100 rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<h3 className="text-xl font-bold mb-2">
								No photos found
							</h3>
							<p>Try changing your filters to see more photos.</p>
						</div>
					))}
			</div>
		</div>
	);
}
