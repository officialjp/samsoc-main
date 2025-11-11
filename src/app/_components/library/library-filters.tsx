'use client';

import type React from 'react';
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
	genres: string[];
	onFilterChange: (filters: FilterState) => void;
	initialFilters: FilterState;
}

export function LibraryFilters({
	genres,
	onFilterChange,
	initialFilters,
}: LibraryFiltersProps) {
	const handleStatusChange = (newStatus: string) => {
		onFilterChange({
			status: newStatus,
			genre: initialFilters.genre,
			search: initialFilters.search,
		});
	};

	const handleGenreChange = (newGenre: string) => {
		onFilterChange({
			status: initialFilters.status,
			genre: newGenre,
			search: initialFilters.search,
		});
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({
			status: initialFilters.status,
			genre: initialFilters.genre,
			search: e.target.value,
		});
	};

	const clearFilters = () => {
		onFilterChange({ status: 'all', genre: 'all', search: '' });
	};

	const hasActiveFilters =
		initialFilters.status !== 'all' ||
		initialFilters.genre !== 'all' ||
		initialFilters.search !== '';

	return (
		<div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<h2 className="text-2xl font-bold mb-6">Filter Manga</h2>
			<div className="flex justify-between items-center mb-6">
				{hasActiveFilters && (
					<Button
						variant="default"
						size="sm"
						onClick={clearFilters}
						className="hover:cursor-pointer"
					>
						<X className="h-3 w-3 mr-1" /> Clear Filters
					</Button>
				)}
			</div>

			<div className="mb-6">
				<label
					htmlFor="search"
					className="block text-sm font-medium mb-2"
				>
					Search
				</label>
				<div className="relative">
					<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						id="search"
						placeholder="Search by title or author..."
						value={initialFilters.search}
						onChange={handleSearchChange}
						className="pl-8 border-2 border-black"
					/>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="text-sm font-medium mb-2">Availability</h3>
				<div className="flex flex-wrap gap-2">
					{['all', 'available', 'borrowed'].map((statusOption) => (
						<Button
							key={statusOption}
							onClick={() => handleStatusChange(statusOption)}
							className={cn(
								'border-2 border-black hover:cursor-pointer',
								initialFilters.status === statusOption
									? statusOption === 'available'
										? 'bg-green-300 hover:bg-green-400 text-black'
										: statusOption === 'borrowed'
											? 'bg-red-300 hover:bg-red-400 text-black'
											: 'bg-about1 hover:bg-about-1 text-black'
									: 'bg-white hover:bg-gray-100 text-black',
							)}
						>
							{statusOption === 'all'
								? 'All'
								: statusOption === 'available'
									? 'Available'
									: 'Borrowed'}
						</Button>
					))}
				</div>
			</div>

			<div>
				<h3 className="text-sm font-medium mb-2">Genre</h3>
				<div className="flex flex-wrap gap-2">
					<Button
						onClick={() => handleGenreChange('all')}
						className={cn(
							'border-2 border-black hover:cursor-pointer',
							initialFilters.genre === 'all'
								? 'bg-about1 hover:bg-about1 text-black'
								: 'bg-white hover:bg-gray-100 text-black',
						)}
					>
						All Genres
					</Button>
					{genres.map((genre) => {
						if (genre === '??') return;
						return (
							<Button
								key={genre}
								onClick={() => handleGenreChange(genre)}
								className={cn(
									'border-2 border-black hover:cursor-pointer',
									initialFilters.genre === genre
										? 'bg-green-300 hover:bg-green-400 text-black'
										: 'bg-white hover:bg-gray-100 text-black',
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
