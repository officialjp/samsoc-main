'use client';

import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import posthog from 'posthog-js';
import { cn } from '~/lib/utils';
import type { Event } from 'generated/prisma/client';

interface EventModalProps {
	event: Event;
	onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
	const hasTrackedRef = useRef(false);

	// Track event view on modal open (using ref to ensure single tracking)
	if (!hasTrackedRef.current) {
		hasTrackedRef.current = true;
		posthog.capture('calendar_event_viewed', {
			event_title: event.title,
			event_date: event.date.toISOString(),
			event_location: event.location,
			is_regular_session: event.is_regular_session,
		});
	}

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [onClose]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 cursor-pointer"
			onClick={onClose}
		>
			<div
				className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl relative cursor-default"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:bg-pink-600 transition-colors cursor-pointer"
					aria-label="Close modal"
				>
					<X className="h-6 w-6" />
				</button>

				<div className={cn('h-2 w-full mb-4', event.color)}></div>

				<h3 className="text-xl font-bold mb-2">
					{event.title}
					{event.is_regular_session && (
						<span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full border border-purple-300">
							Weekly Session
						</span>
					)}
				</h3>

				<div className="mb-4">
					<div className="text-sm text-gray-500 mb-1">
						{format(event.date, 'EEEE, MMMM d, yyyy, p')}
					</div>
					<div className="text-sm font-medium">
						📍 {event.location}
					</div>
				</div>

				<p className="text-gray-700">{event.description}</p>
			</div>
		</div>
	);
}
