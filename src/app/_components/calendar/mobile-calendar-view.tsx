'use client';

import { useState, useMemo, memo, lazy, Suspense } from 'react';
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

const EventModal = lazy(() =>
	import('./event-modal').then((mod) => ({ default: mod.EventModal })),
);

interface MobileCalendarViewProps {
	currentMonth: Date;
	selectedDate: Date;
	groupedEvents: Record<string, Event[]>;
	onDateClick: (day: Date) => void;
}

const DayCell = memo(
	({
		day,
		currentMonth,
		selectedDate,
		hasEvents,
		onClick,
	}: {
		day: Date;
		currentMonth: Date;
		selectedDate: Date;
		hasEvents: boolean;
		onClick: () => void;
	}) => {
		const formattedDate = format(day, 'd');
		const isToday = isSameDay(day, new Date());
		const isSelected = isSameDay(day, selectedDate);
		const isCurrentMonthDay = isSameMonth(day, currentMonth);

		return (
			<div
				className={cn(
					'h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer mx-auto',
					isCurrentMonthDay ? 'text-gray-700' : 'text-gray-300',
					isToday ? 'bg-pink-500 text-white' : '',
					isSelected && !isToday ? 'bg-yellow-300' : '',
					hasEvents && !isToday && !isSelected
						? 'border-2 border-cyan-500'
						: '',
				)}
				onClick={onClick}
			>
				{formattedDate}
			</div>
		);
	},
);

DayCell.displayName = 'DayCell';

const EventRow = memo(
	({
		dateKey,
		day,
		events,
		isExpanded,
		onToggle,
		onEventClick,
	}: {
		dateKey: string;
		day: Date;
		events: Event[];
		isExpanded: boolean;
		onToggle: () => void;
		onEventClick: (event: Event) => void;
	}) => {
		const isToday = isSameDay(day, new Date());

		return (
			<div className="border-2 border-black bg-white">
				<div
					className={cn(
						'flex items-center justify-between p-3 cursor-pointer',
						isToday ? 'bg-pink-100' : '',
					)}
					onClick={onToggle}
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
								onClick={() => onEventClick(event)}
							>
								<div className="font-medium">{event.title}</div>
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
	},
);

EventRow.displayName = 'EventRow';

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
					return (
						<DayCell
							key={dateKey}
							day={day}
							currentMonth={currentMonth}
							selectedDate={selectedDate}
							hasEvents={hasEventsMap.get(dateKey) ?? false}
							onClick={() => onDateClick(day)}
						/>
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

						return (
							<EventRow
								key={dateKey}
								dateKey={dateKey}
								day={day}
								events={events}
								isExpanded={isExpanded}
								onToggle={() => toggleDateExpansion(dateKey)}
								onEventClick={setSelectedEvent}
							/>
						);
					})
				) : (
					<div className="text-center p-4 bg-gray-100 border-2 border-black">
						No events scheduled this month
					</div>
				)}
			</div>
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
