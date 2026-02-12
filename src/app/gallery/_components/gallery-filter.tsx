import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface GalleryFilterProps {
	categories: readonly string[];
	years: readonly string[];
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
								'border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer transition-all',
								activeCategory === category
									? 'bg-pink-500 text-white hover:bg-pink-600'
									: 'bg-white text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50',
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
								'border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer transition-all',
								activeYear === year
									? 'bg-cyan-500 text-white hover:bg-cyan-600'
									: 'bg-white text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50',
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
