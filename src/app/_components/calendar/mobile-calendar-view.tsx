'use client';

import { useState, useMemo } from 'react';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	isSameMonth,
	isSameDay,
	eachDayOfInterval,
} from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '~/lib/utils';
import type { Event } from 'generated/prisma';
import { EventModal } from './event-modal';

interface MobileCalendarViewProps {
	currentMonth: Date;
	selectedDate: Date;
	groupedEvents: Record<string, Event[]>;
	onDateClick: (day: Date) => void;
}

export function MobileCalendarView({
	currentMonth,
	selectedDate,
	groupedEvents,
	onDateClick,
}: MobileCalendarViewProps) {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [expandedDate, setExpandedDate] = useState<string | null>(null);

	const daysInMonth = useMemo(() => {
		const monthStart = startOfWeek(startOfMonth(currentMonth));
		const monthEnd = endOfMonth(startOfMonth(currentMonth));
		return eachDayOfInterval({ start: monthStart, end: monthEnd });
	}, [currentMonth]);

	const sortedEventKeys = useMemo(
		() => Object.keys(groupedEvents).sort(),
		[groupedEvents],
	);

	const hasEventsMap = useMemo(() => {
		const map = new Map<string, boolean>();
		for (const key in groupedEvents) {
			const events = groupedEvents[key];
			map.set(key, events !== undefined && events.length > 0);
		}
		return map;
	}, [groupedEvents]);

	const toggleDateExpansion = (dateKey: string) => {
		setExpandedDate((prev) => (prev === dateKey ? null : dateKey));
	};

	return (
		<div className="mt-4">
			<div className="grid grid-cols-7 gap-1 mb-6">
				{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
					<div key={i} className="text-center text-xs font-bold">
						{day}
					</div>
				))}

				{daysInMonth.map((day) => {
					const dateKey = format(day, 'yyyy-MM-dd');
					const formattedDate = format(day, 'd');
					const isToday = isSameDay(day, new Date());
					const isSelected = isSameDay(day, selectedDate);
					const isCurrentMonthDay = isSameMonth(day, currentMonth);
					const dayHasEvents = hasEventsMap.get(dateKey) ?? false;

					return (
						<div
							key={dateKey}
							className={cn(
								'h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer mx-auto',
								isCurrentMonthDay
									? 'text-gray-700'
									: 'text-gray-300',
								isToday ? 'bg-pink-500 text-white' : '',
								isSelected && !isToday ? 'bg-yellow-300' : '',
								dayHasEvents && !isToday && !isSelected
									? 'border-2 border-cyan-500'
									: '',
							)}
							onClick={() => onDateClick(day)}
						>
							{formattedDate}
						</div>
					);
				})}
			</div>

			<div className="space-y-2">
				<h3 className="font-bold text-lg mb-3 border-b-2 border-black pb-1">
					Events This Month
				</h3>

				{sortedEventKeys.length > 0 ? (
					sortedEventKeys.map((dateKey) => {
						const day = new Date(dateKey);
						const events = groupedEvents[dateKey] ?? [];
						const isExpanded = expandedDate === dateKey;
						const isToday = isSameDay(day, new Date());

						return (
							<div
								key={dateKey}
								className="border-2 border-black bg-white"
							>
								<div
									className={cn(
										'flex items-center justify-between p-3 cursor-pointer',
										isToday ? 'bg-pink-100' : '',
									)}
									onClick={() => toggleDateExpansion(dateKey)}
								>
									<div>
										<span className="font-bold">
											{format(day, 'EEEE, MMMM d')}
										</span>
										<span className="ml-2 text-sm text-gray-500">
											({events.length} event
											{events.length !== 1 ? 's' : ''})
										</span>
									</div>
									{isExpanded ? (
										<ChevronUp className="h-5 w-5" />
									) : (
										<ChevronDown className="h-5 w-5" />
									)}
								</div>

								{isExpanded && (
									<div className="p-3 border-t border-gray-200 space-y-2">
										{events.map((event) => (
											<div
												key={event.id}
												className={cn(
													'p-2 border border-gray-200 cursor-pointer',
													event.color,
													event.is_regular_session &&
														'border-l-4 border-l-purple-500',
												)}
												onClick={() =>
													setSelectedEvent(event)
												}
											>
												<div className="font-medium">
													{event.title}
												</div>
												<div className="text-xs text-gray-500">
													📍 {event.location} |{' '}
													{format(event.date, 'p')}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})
				) : (
					<div className="text-center p-4 bg-gray-100 border-2 border-black">
						No events scheduled this month
					</div>
				)}
			</div>

			{selectedEvent && (
				<EventModal
					event={selectedEvent}
					onClose={() => setSelectedEvent(null)}
				/>
			)}
		</div>
	);
}
