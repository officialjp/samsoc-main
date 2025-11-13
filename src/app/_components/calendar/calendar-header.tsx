'use client';

import { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface CalendarHeaderProps {
	currentMonth: Date;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onCurrentMonth: () => void;
}

export const CalendarHeader = memo(function CalendarHeader({
	currentMonth,
	onPrevMonth,
	onNextMonth,
	onCurrentMonth,
}: CalendarHeaderProps) {
	const { desktopDate, mobileDate } = useMemo(() => {
		const desktopFormat = new Intl.DateTimeFormat('en-US', {
			month: 'long',
			year: 'numeric',
		});
		const mobileFormat = new Intl.DateTimeFormat('en-US', {
			month: 'short',
			year: 'numeric',
		});

		return {
			desktopDate: desktopFormat.format(currentMonth),
			mobileDate: mobileFormat.format(currentMonth),
		};
	}, [currentMonth]);

	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex gap-2">
				<Button
					onClick={onPrevMonth}
					variant="outline"
					className="bg-about1 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer h-9 w-9 p-0 md:h-10 md:w-10 md:px-4 md:py-2"
					aria-label="Previous month"
				>
					<ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
				</Button>
				<Button
					onClick={onNextMonth}
					variant="outline"
					className="bg-about1 border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer h-9 w-9 p-0 md:h-10 md:w-10 md:px-4 md:py-2"
					aria-label="Next month"
				>
					<ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
				</Button>
			</div>

			<h2 className="font-bold px-4 py-2 text-lg md:text-2xl">
				<span className="md:hidden">{mobileDate}</span>
				<span className="hidden md:inline">{desktopDate}</span>
			</h2>

			<Button
				onClick={onCurrentMonth}
				className="bg-pink-300 hover:bg-pink-400 text-black border-2 rounded-2xl border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:cursor-pointer h-9 px-3 text-sm md:h-10 md:px-4 md:py-2 md:text-base"
			>
				Today
			</Button>
		</div>
	);
});
