'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '~/lib/utils';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];

		pages.push(1);

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		if (start > 2) {
			pages.push('ellipsis-start');
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (end < totalPages - 1) {
			pages.push('ellipsis-end');
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex items-center justify-center space-x-2 mt-8">
			<Button
				variant="outline"
				className="border-2 border-black hover:cursor-pointer bg-white"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{pageNumbers.map((page, index) => {
				if (page === 'ellipsis-start' || page === 'ellipsis-end') {
					return (
						<span key={`ellipsis-${index}`} className="px-3 py-2">
							...
						</span>
					);
				}

				return (
					<Button
						key={`page-${page}`}
						variant="outline"
						className={cn(
							'border-2 border-black h-10 w-10 p-0 hover:cursor-pointer',
							currentPage === page
								? 'bg-button2 hover:bg-button1 text-black'
								: 'bg-white hover:bg-gray-100 text-black',
						)}
						onClick={() => onPageChange(Number(page))}
					>
						{page}
					</Button>
				);
			})}

			<Button
				variant="outline"
				className="border-2 border-black hover:cursor-pointer bg-white"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
