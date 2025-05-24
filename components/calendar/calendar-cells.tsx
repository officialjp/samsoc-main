'use client';

import { useState } from 'react';
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
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
	id: string;
	title: string;
	description: string;
	location: string;
	date: Date;
	color: string;
	isRegularSession?: boolean;
}

interface CalendarCellsProps {
	currentMonth: Date;
	selectedDate: Date;
	events: Event[];
	onDateClick: (day: Date) => void;
}

export function CalendarCells({
	currentMonth,
	selectedDate,
	events,
	onDateClick,
}: CalendarCellsProps) {
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

	const rows = [];
	let days = [];
	let day = startDate;
	let formattedDate = '';

	while (day <= endDate) {
		for (let i = 0; i < 7; i++) {
			formattedDate = format(day, 'd');
			const cloneDay = day;
			const dayEvents = events.filter((event) =>
				isSameDay(event.date, day),
			);

			days.push(
				<div
					key={day.toString()}
					className={cn(
						'min-h-[120px] border-2 border-black m-1 p-1 relative',
						!isSameMonth(day, monthStart)
							? 'bg-gray-100'
							: 'bg-white',
						isSameDay(day, selectedDate) ? 'bg-yellow-100' : '',
					)}
					onClick={() => onDateClick(cloneDay)}
				>
					<div className="flex justify-between">
						<span
							className={cn(
								'font-bold text-lg',
								!isSameMonth(day, monthStart)
									? 'text-gray-400'
									: '',
								isSameDay(day, new Date())
									? 'bg-pink-500 text-white h-8 w-8 rounded-full flex items-center justify-center'
									: '',
							)}
						>
							{formattedDate}
						</span>
						{/* Show day of week for current month */}
						{isSameMonth(day, monthStart) && (
							<span className="text-xs text-gray-500">
								{format(day, 'EEE')}
							</span>
						)}
					</div>

					<div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
						{dayEvents.map((event) => (
							<div
								key={event.id}
								className={cn(
									'text-xs p-1 border border-black cursor-pointer truncate',
									event.color,
									event.isRegularSession &&
										'border-l-4 border-l-purple-500',
								)}
								onClick={(e) => {
									e.stopPropagation();
									setSelectedEvent(event);
								}}
							>
								{event.title}
							</div>
						))}
					</div>
				</div>,
			);
			day = addDays(day, 1);
		}

		rows.push(
			<div key={day.toString()} className="grid grid-cols-7">
				{days}
			</div>,
		);
		days = [];
	}

	return (
		<div>
			{rows}

			{/* Event Details Modal */}
			{selectedEvent && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 hover:cursor-pointer"
					onClick={() => setSelectedEvent(null)}
				>
					<div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative hover:cursor-default">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setSelectedEvent(null);
							}}
							className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:cursor-pointer"
						>
							<X className="h-6 w-6" />
						</button>

						<div
							className={cn(
								'h-2 w-full mb-4',
								selectedEvent.color,
							)}
						></div>

						<h3 className="text-xl font-bold mb-2">
							{selectedEvent.title}
							{selectedEvent.isRegularSession && (
								<span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-300">
									Weekly Session
								</span>
							)}
						</h3>

						<div className="mb-4">
							<div className="text-sm text-gray-500 mb-1">
								{format(
									selectedEvent.date,
									'EEEE, MMMM d, yyyy',
								)}
							</div>
							<div className="text-sm font-medium">
								📍 {selectedEvent.location}
							</div>
						</div>

						<p className="text-gray-700">
							{selectedEvent.description}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
