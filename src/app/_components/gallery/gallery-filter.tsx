import { Button } from '~/app/_components/ui/button';
import { cn } from '~/lib/utils';

interface GalleryFilterProps {
	categories: readonly string[];
	years: string[];
	onCategoryChange: (category: string) => void;
	onYearChange: (year: string) => void;
	activeCategory: string;
	activeYear: string;
}

export default function GalleryFilter({
	categories,
	years,
	onCategoryChange,
	onYearChange,
	activeCategory,
	activeYear,
}: GalleryFilterProps) {
	const handleCategoryClick = (category: string) => {
		onCategoryChange(category);
	};

	const handleYearClick = (year: string) => {
		onYearChange(year);
	};

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h3 className="text-lg font-bold">Categories</h3>
				<div
					className="flex flex-wrap gap-2"
					role="group"
					aria-label="Category filters"
				>
					{categories.map((category) => (
						<Button
							key={category}
							onClick={() => handleCategoryClick(category)}
							className={cn(
								'border-2 border-black hover:cursor-pointer',
								activeCategory === category
									? 'bg-pink-500 text-white hover:bg-pink-600'
									: 'bg-white text-black hover:bg-gray-100',
							)}
							aria-pressed={activeCategory === category}
						>
							{category}
						</Button>
					))}
				</div>
			</div>

			<div className="space-y-3">
				<h3 className="text-lg font-bold">Years</h3>
				<div
					className="flex flex-wrap gap-2"
					role="group"
					aria-label="Year filters"
				>
					{years.map((year) => (
						<Button
							key={year}
							onClick={() => handleYearClick(year)}
							className={cn(
								'border-2 border-black hover:cursor-pointer',
								activeYear === year
									? 'bg-cyan-500 text-white hover:bg-cyan-600'
									: 'bg-white text-black hover:bg-gray-100',
							)}
							aria-pressed={activeYear === year}
						>
							{year}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
