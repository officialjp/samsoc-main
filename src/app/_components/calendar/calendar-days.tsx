'use client';

import { memo } from 'react';

const DAYS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
] as const;

export const CalendarDays = memo(function CalendarDays() {
	return (
		<div className="grid grid-cols-7 mb-2">
			{DAYS.map((day) => (
				<div
					key={day}
					className="text-center py-2 font-bold bg-about2 border-2 border-black mx-1"
				>
					<span className="hidden md:inline">{day}</span>
					<span className="md:hidden">{day.slice(0, 3)}</span>
				</div>
			))}
		</div>
	);
});
