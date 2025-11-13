'use client';

import { useState, useMemo, memo, lazy, Suspense } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	isSameMonth,
	isSameDay,
} from 'date-fns';
import { cn } from '~/lib/utils';
import type { Event } from 'generated/prisma';

const EventModal = lazy(() =>
	import('./event-modal').then((mod) => ({ default: mod.EventModal })),
);

interface CalendarCellsProps {
	currentMonth: Date;
	selectedDate: Date;
	eventsMap: Map<string, Event[]>;
	onDateClick: (day: Date) => void;
}

const CalendarCell = memo(
	({
		day,
		currentMonth,
		selectedDate,
		dayEvents,
		onClick,
		onEventClick,
	}: {
		day: Date;
		currentMonth: Date;
		selectedDate: Date;
		dayEvents: Event[];
		onClick: () => void;
		onEventClick: (event: Event) => void;
	}) => {
		const formattedDate = format(day, 'd');
		const isCurrentMonth = isSameMonth(day, currentMonth);
		const isSelected = isSameDay(day, selectedDate);
		const isToday = isSameDay(day, new Date());

		return (
			<div
				className={cn(
					'min-h-[120px] border-2 border-black m-1 p-1 relative cursor-pointer',
					!isCurrentMonth ? 'bg-gray-100' : 'bg-white',
					isSelected ? 'bg-yellow-100' : '',
				)}
				onClick={onClick}
			>
				<div className="flex justify-between">
					<span
						className={cn(
							'font-bold text-lg',
							!isCurrentMonth ? 'text-gray-400' : '',
							isToday
								? 'bg-pink-500 text-white h-8 w-8 rounded-full flex items-center justify-center'
								: '',
						)}
					>
						{formattedDate}
					</span>
					{isCurrentMonth && (
						<span className="text-xs text-gray-500">
							{format(day, 'EEE')}
						</span>
					)}
				</div>

				<div className="mt-1 space-y-1 overflow-y-auto max-h-20">
					{dayEvents.map((event) => (
						<div
							key={event.id}
							className={cn(
								'text-xs p-1 border border-black cursor-pointer truncate',
								event.color,
								event.is_regular_session &&
									'border-l-4 border-l-purple-500',
							)}
							onClick={(e) => {
								e.stopPropagation();
								onEventClick(event);
							}}
						>
							{event.title}
						</div>
					))}
				</div>
			</div>
		);
	},
);

CalendarCell.displayName = 'CalendarCell';

export function CalendarCells({
	currentMonth,
	selectedDate,
	eventsMap,
	onDateClick,
}: CalendarCellsProps) {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);

		const days: Date[] = [];
		let day = startDate;

		while (day <= endDate) {
			days.push(day);
			day = addDays(day, 1);
		}

		return days;
	}, [currentMonth]);

	const weeks = useMemo(() => {
		const weeksArray: Date[][] = [];
		for (let i = 0; i < calendarDays.length; i += 7) {
			weeksArray.push(calendarDays.slice(i, i + 7));
		}
		return weeksArray;
	}, [calendarDays]);

	return (
		<div>
			{weeks.map((week, weekIndex) => (
				<div key={weekIndex} className="grid grid-cols-7">
					{week.map((day) => {
						const dateKey = format(day, 'yyyy-MM-dd');
						const dayEvents = eventsMap.get(dateKey) ?? [];

						return (
							<CalendarCell
								key={day.toString()}
								day={day}
								currentMonth={currentMonth}
								selectedDate={selectedDate}
								dayEvents={dayEvents}
								onClick={() => onDateClick(day)}
								onEventClick={setSelectedEvent}
							/>
						);
					})}
				</div>
			))}
			{selectedEvent && (
				<Suspense fallback={null}>
					<EventModal
						event={selectedEvent}
						onClose={() => setSelectedEvent(null)}
					/>
				</Suspense>
			)}
		</div>
	);
}
