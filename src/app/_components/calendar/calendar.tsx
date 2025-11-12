'use client';

import { useState, useMemo } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { CalendarHeader } from './calendar-header';
import { CalendarDays } from './calendar-days';
import { CalendarCells } from './calendar-cells';
import { MobileCalendarView } from './mobile-calendar-view';
import type { Event } from 'generated/prisma';

interface CalendarProps {
	events: Event[];
}

export function Calendar({ events }: CalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());

	const prevMonth = () => {
		setCurrentMonth(subMonths(currentMonth, 1));
	};

	const nextMonth = () => {
		setCurrentMonth(addMonths(currentMonth, 1));
	};

	const onDateClick = (day: Date) => {
		setSelectedDate(day);
	};

	const onCurrentMonth = () => {
		setCurrentMonth(new Date());
		setSelectedDate(new Date());
	};

	const groupedEvents = useMemo(() => {
		const monthStart = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth(),
			1,
		);
		const monthEnd = new Date(
			currentMonth.getFullYear(),
			currentMonth.getMonth() + 1,
			0,
		);

		const currentMonthEvents = events.filter((event) => {
			const eventDate = new Date(event.date);
			return eventDate >= monthStart && eventDate <= monthEnd;
		});

		return currentMonthEvents.reduce(
			(acc, event) => {
				const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
				acc[dateKey] ??= [];
				acc[dateKey].push(event);
				return acc;
			},
			{} as Record<string, Event[]>,
		);
	}, [events, currentMonth]);

	return (
		<div className="bg-white overflow-hidden border-2 rounded-2xl border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<CalendarHeader
				currentMonth={currentMonth}
				onPrevMonth={prevMonth}
				onNextMonth={nextMonth}
				onCurrentMonth={onCurrentMonth}
			/>

			<div className="md:hidden">
				<MobileCalendarView
					currentMonth={currentMonth}
					selectedDate={selectedDate}
					events={events}
					groupedEvents={groupedEvents}
					onDateClick={onDateClick}
				/>
			</div>

			<div className="hidden md:block">
				<CalendarDays />
				<CalendarCells
					currentMonth={currentMonth}
					selectedDate={selectedDate}
					events={events}
					onDateClick={onDateClick}
				/>
			</div>
		</div>
	);
}
