'use client';

import { cn } from '@/lib/utils';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CalendarHeaderProps {
	currentMonth: Date;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onCurrentMonth: () => void;
}

export function CalendarHeader({
	currentMonth,
	onPrevMonth,
	onNextMonth,
	onCurrentMonth,
}: CalendarHeaderProps) {
	const isMobile = useMediaQuery('(max-width: 768px)');

	const dateFormat = new Intl.DateTimeFormat('en-US', {
		month: isMobile ? 'short' : 'long',
		year: 'numeric',
	});

	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex gap-2">
				<Button
					onClick={onPrevMonth}
					variant="outline"
					className="bg-about1 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer"
					size={isMobile ? 'sm' : 'default'}
				>
					<ChevronLeft className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
				</Button>
				<Button
					onClick={onNextMonth}
					variant="outline"
					className="bg-about1 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer"
					size={isMobile ? 'sm' : 'default'}
				>
					<ChevronRight
						className={isMobile ? 'h-4 w-4' : 'h-5 w-5'}
					/>
				</Button>
			</div>

			<h2
				className={cn(
					'font-bold bg-button1 px-4 py-2 border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1',
					isMobile ? 'text-lg' : 'text-2xl',
				)}
			>
				{dateFormat.format(currentMonth)}
			</h2>

			<Button
				onClick={onCurrentMonth}
				className="bg-pink-300 hover:bg-pink-400 text-black border-2 rounded-md border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer"
				size={isMobile ? 'sm' : 'default'}
			>
				Today
			</Button>
		</div>
	);
}
