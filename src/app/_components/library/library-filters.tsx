'use client';

import { Search, X } from 'lucide-react';
import { Button } from '~/app/_components/ui/button';
import { Input } from '~/app/_components/ui/input';
import { cn } from '~/lib/utils';

interface FilterState {
	status: string;
	genre: string;
	search: string;
}

interface LibraryFiltersProps {
	genres: readonly string[];
	onFilterChange: (filters: FilterState) => void;
	filters: FilterState;
}

const STATUS_OPTIONS = [
	{ value: 'all', label: 'All', colorClass: 'bg-about1 hover:bg-about1' },
	{
		value: 'available',
		label: 'Available',
		colorClass: 'bg-green-300 hover:bg-green-400',
	},
	{
		value: 'borrowed',
		label: 'Borrowed',
		colorClass: 'bg-red-300 hover:bg-red-400',
	},
] as const;

export default function LibraryFilters({
	genres,
	onFilterChange,
	filters,
}: LibraryFiltersProps) {
	const handleStatusChange = (newStatus: string) => {
		onFilterChange({ ...filters, status: newStatus });
	};

	const handleGenreChange = (newGenre: string) => {
		onFilterChange({ ...filters, genre: newGenre });
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({ ...filters, search: e.target.value });
	};

	const clearFilters = () => {
		onFilterChange({ status: 'all', genre: 'all', search: '' });
	};

	const hasActiveFilters =
		filters.status !== 'all' ||
		filters.genre !== 'all' ||
		filters.search !== '';

	return (
		<div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold">Filter Manga</h2>
				{hasActiveFilters && (
					<Button
						variant="default"
						size="sm"
						onClick={clearFilters}
						className="hover:cursor-pointer"
					>
						<X className="mr-1 h-3 w-3" /> Clear
					</Button>
				)}
			</div>

			<div className="mb-6">
				<label
					htmlFor="search"
					className="mb-2 block text-sm font-medium"
				>
					Search
				</label>
				<div className="relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						id="search"
						type="search"
						placeholder="Search by title or author..."
						value={filters.search}
						onChange={handleSearchChange}
						className="border-2 border-black pl-8"
					/>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="mb-2 text-sm font-medium">Availability</h3>
				<div className="flex flex-wrap gap-2">
					{STATUS_OPTIONS.map(({ value, label, colorClass }) => (
						<Button
							key={value}
							onClick={() => handleStatusChange(value)}
							className={cn(
								'border-2 border-black hover:cursor-pointer',
								filters.status === value
									? `${colorClass} text-black`
									: 'bg-white text-black hover:bg-gray-100',
							)}
						>
							{label}
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="mb-2 text-sm font-medium">Genre</h3>
				<div className="flex flex-wrap gap-2">
					<Button
						onClick={() => handleGenreChange('all')}
						className={cn(
							'border-2 border-black hover:cursor-pointer',
							filters.genre === 'all'
								? 'bg-about1 text-black hover:bg-about1'
								: 'bg-white text-black hover:bg-gray-100',
						)}
					>
						All Genres
					</Button>
					{genres.map((genre) => {
						if (genre === '??') return null;
						return (
							<Button
								key={genre}
								onClick={() => handleGenreChange(genre)}
								className={cn(
									'border-2 border-black hover:cursor-pointer',
									filters.genre === genre
										? 'bg-green-300 text-black hover:bg-green-400'
										: 'bg-white text-black hover:bg-gray-100',
								)}
							>
								{genre}
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
