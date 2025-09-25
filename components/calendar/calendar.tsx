'use client';

import { useState, useEffect } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { isMobile } from 'react-device-detect';
import { CalendarHeader } from './calendar-header';
import { CalendarDays } from './calendar-days';
import { CalendarCells } from './calendar-cells';
import { MobileCalendarView } from './mobile-calendar-view';

interface Event {
	id: string;
	title: string;
	description: string;
	location: string;
	date: Date;
	color: string;
	isRegularSession?: boolean;
}

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

	// Group events by date for mobile view
	const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>(
		{},
	);

	useEffect(() => {
		// Only process this for mobile view to save resources
		if (isMobile) {
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

			// Filter events for current month
			const currentMonthEvents = events.filter((event) => {
				const eventDate = new Date(event.date);
				return eventDate >= monthStart && eventDate <= monthEnd;
			});

			// Group by date
			const grouped = currentMonthEvents.reduce(
				(acc, event) => {
					const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
					if (!acc[dateKey]) {
						acc[dateKey] = [];
					}
					acc[dateKey].push(event);
					return acc;
				},
				{} as Record<string, Event[]>,
			);

			setGroupedEvents(grouped);
		}
	}, [events, currentMonth, isMobile]);
	return (
		<div className="bg-white overflow-hidden border-2 rounded-2xl border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] SAManim SAMfade-up SAMduration-700 SAMdelay-500 SAMbounce">
			<CalendarHeader
				currentMonth={currentMonth}
				onPrevMonth={prevMonth}
				onNextMonth={nextMonth}
				onCurrentMonth={onCurrentMonth}
			/>

			{isMobile ? (
				<MobileCalendarView
					currentMonth={currentMonth}
					selectedDate={selectedDate}
					events={events}
					groupedEvents={groupedEvents}
					onDateClick={onDateClick}
				/>
			) : (
				<>
					<CalendarDays />
					<CalendarCells
						currentMonth={currentMonth}
						selectedDate={selectedDate}
						events={events}
						onDateClick={onDateClick}
					/>
				</>
			)}
		</div>
	);
}
