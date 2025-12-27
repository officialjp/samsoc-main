'use client';

import { useState } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { CalendarHeader } from './calendar-header';
import { CalendarDays } from './calendar-days';
import { CalendarCells } from './calendar-cells';
import type { Event } from '@prisma/client';
import { MobileCalendarView } from './mobile-calendar-view';
import { useRouter, useSearchParams } from 'next/navigation';

interface CalendarProps {
	events: Event[];
	initialYear: number;
	initialMonth: number;
}

export function Calendar({ events, initialYear, initialMonth }: CalendarProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentMonth, setCurrentMonth] = useState(
		new Date(initialYear, initialMonth),
	);
	const [selectedDate, setSelectedDate] = useState(
		new Date(initialYear, initialMonth),
	);

	const updateUrlParams = (year: number, month: number) => {
		const params = new URLSearchParams(searchParams);
		params.set('year', year.toString());
		params.set('month', month.toString());
		router.push(`/calendar?${params.toString()}`);
	};

	const prevMonth = () => {
		const newMonth = subMonths(currentMonth, 1);
		setCurrentMonth(newMonth);
		updateUrlParams(newMonth.getFullYear(), newMonth.getMonth());
	};

	const nextMonth = () => {
		const newMonth = addMonths(currentMonth, 1);
		setCurrentMonth(newMonth);
		updateUrlParams(newMonth.getFullYear(), newMonth.getMonth());
	};

	const onDateClick = (day: Date) => {
		setSelectedDate(day);
	};

	const onCurrentMonth = () => {
		const now = new Date();
		setCurrentMonth(now);
		setSelectedDate(now);
		updateUrlParams(now.getFullYear(), now.getMonth());
	};

	const groupedEvents: Record<string, Event[]> = {};
	for (const event of events) {
		const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
		groupedEvents[dateKey] ??= [];
		groupedEvents[dateKey].push(event);
	}

	const eventsMap = new Map<string, Event[]>();
	for (const event of events) {
		const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
		const existing = eventsMap.get(dateKey);
		if (existing) {
			existing.push(event);
		} else {
			eventsMap.set(dateKey, [event]);
		}
	}

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
					groupedEvents={groupedEvents}
					onDateClick={onDateClick}
				/>
			</div>

			<div className="hidden md:block">
				<CalendarDays />
				<CalendarCells
					currentMonth={currentMonth}
					selectedDate={selectedDate}
					eventsMap={eventsMap}
					onDateClick={onDateClick}
				/>
			</div>
		</div>
	);
}
