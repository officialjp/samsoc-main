'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import { CalendarHeader } from './calendar-header';
import { CalendarDays } from './calendar-days';
import { CalendarCells } from './calendar-cells';
import type { Event } from 'generated/prisma';
import { MobileCalendarView } from './mobile-calendar-view';

interface CalendarProps {
	events: Event[];
}

export function Calendar({ events }: CalendarProps) {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const prevMonth = useCallback(() => {
		setCurrentMonth((prev) => subMonths(prev, 1));
	}, []);

	const nextMonth = useCallback(() => {
		setCurrentMonth((prev) => addMonths(prev, 1));
	}, []);

	const onDateClick = useCallback((day: Date) => {
		setSelectedDate(day);
	}, []);

	const onCurrentMonth = useCallback(() => {
		const now = new Date();
		setCurrentMonth(now);
		setSelectedDate(now);
	}, []);

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

		const filtered = events.filter((event) => {
			const eventDate = new Date(event.date);
			return eventDate >= monthStart && eventDate <= monthEnd;
		});

		const grouped: Record<string, Event[]> = {};
		for (const event of filtered) {
			const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
			grouped[dateKey] ??= [];
			grouped[dateKey].push(event);
		}

		return grouped;
	}, [events, currentMonth]);

	const eventsMap = useMemo(() => {
		const map = new Map<string, Event[]>();
		for (const event of events) {
			const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
			const existing = map.get(dateKey);
			if (existing) {
				existing.push(event);
			} else {
				map.set(dateKey, [event]);
			}
		}
		return map;
	}, [events]);

	return (
		<div className="bg-white overflow-hidden border-2 rounded-2xl border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<CalendarHeader
				currentMonth={currentMonth}
				onPrevMonth={prevMonth}
				onNextMonth={nextMonth}
				onCurrentMonth={onCurrentMonth}
			/>

			<div className="md:hidden">
				<Suspense
					fallback={
						<div className="h-96 flex items-center justify-center">
							<div className="text-gray-500">
								Loading calendar...
							</div>
						</div>
					}
				>
					<MobileCalendarView
						currentMonth={currentMonth}
						selectedDate={selectedDate}
						groupedEvents={groupedEvents}
						onDateClick={onDateClick}
					/>
				</Suspense>
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
