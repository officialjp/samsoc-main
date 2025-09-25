'use client';
import { useEffect, useState } from 'react';
import { Calendar } from '@/components/calendar/calendar';
import supabase from '@/utils/supabase/client';
import { CalendarEventType } from '@/lib/definitions';
import { parseISO } from 'date-fns';
import InView from '@/components/scroll-view-card';

const CalendarWithData: React.FC = () => {
	const [events, setEvents] = useState<CalendarEventType[]>([]);

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCalendarData = async () => {
			try {
				setError(null);

				const { data: fetchedEvents, error: eventsError } =
					await supabase
						.from('events')
						.select()
						.eq('isregularsession', false);

				if (eventsError) {
					setError(`Error fetching events: ${eventsError.message}`);
					return;
				}

				const { data: fetchedRegSession, error: regSessionError } =
					await supabase
						.from('events')
						.select()
						.eq('isregularsession', true);

				if (regSessionError) {
					setError(
						`Error fetching regular sessions: ${regSessionError.message}`,
					);
					return;
				}

				const generateWeeklySession = (): CalendarEventType[] => {
					const sessions: CalendarEventType[] = [];

					fetchedRegSession?.forEach((session) => {
						let currentDate: Date = parseISO(session.date);
						for (let i = 0; i < 12; i++) {
							if (i > 0) {
								sessions.push({
									id: session.id,
									title: session.title,
									description: session.description,
									location: session.location,
									date: new Date(currentDate),
									color: 'bg-purple-200',
									isRegularSession: true,
								});
								currentDate = new Date(
									currentDate.setDate(
										currentDate.getDate() + 7,
									),
								);
							} else {
								sessions.push({
									id: session.id,
									title: 'Voting Session',
									description:
										'Sit down with us and vote on which 3 animes we will be watching this semester!',
									location: session.location,
									date: new Date(currentDate),
									color: 'bg-purple-200',
									isRegularSession: true,
								});
								currentDate = new Date(
									currentDate.setDate(
										currentDate.getDate() + 7,
									),
								);
							}
						}
					});

					return sessions;
				};

				const weeklySessions = generateWeeklySession();
				const allEvents = [
					...(fetchedEvents as []),
					...weeklySessions,
				] as CalendarEventType[];

				setEvents(allEvents);
			} catch (err: any) {
				setError(`An unexpected error occurred: ${err.message}`);
			}
		};

		fetchCalendarData();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<>
			<InView>
				<Calendar events={events} />
			</InView>
			<InView>
				<div className="mt-12 bg-white border-2 rounded-2xl border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] SAManim SAMfade-in SAMduration-700 SAMdelay-200 SAMbounce">
					<h3 className="text-xl font-bold mb-4">
						Event Color Guide
					</h3>
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						<div className="flex items-center">
							<div className="w-4 h-4 bg-purple-200 border border-black mr-2"></div>
							<span>Weekly Anime Screenings</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 bg-pink-200 border border-black mr-2"></div>
							<span>Socials</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 bg-cyan-200 border border-black mr-2"></div>
							<span>Trips</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 bg-yellow-200 border border-black mr-2"></div>
							<span>Special Screenings</span>
						</div>
						<div className="flex items-center">
							<div className="w-4 h-4 bg-green-200 border border-black mr-2"></div>
							<span>Other</span>
						</div>
					</div>
				</div>
			</InView>
		</>
	);
};

export default CalendarWithData;
