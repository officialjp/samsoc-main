"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/calendar/calendar";
import { createClient } from "@/utils/supabase/client";
import { CalendarEventType } from "@/lib/definitions";
import { parseISO } from "date-fns";

const CalendarWithData: React.FC = () => {
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { data: fetchedEvents, error: eventsError } = await supabase
          .from("events")
          .select()
          .eq("isregularsession", false);

        if (eventsError) {
          setError(`Error fetching events: ${eventsError.message}`);
          return;
        }

        const { data: fetchedRegSession, error: regSessionError } =
          await supabase.from("events").select().eq("isregularsession", true);

        if (regSessionError) {
          setError(
            `Error fetching regular sessions: ${regSessionError.message}`
          );
          return;
        }

        const generateWeeklySession = (): CalendarEventType[] => {
          const sessions: CalendarEventType[] = [];

          fetchedRegSession?.forEach((session) => {
            let currentDate: Date = parseISO(session.date);
            for (let i = 0; i < 12; i++) {
              sessions.push({
                id: session.id,
                title: session.title,
                description: session.description,
                location: session.location,
                date: new Date(currentDate),
                color: "bg-purple-200",
                isRegularSession: true,
              });
              currentDate = new Date(
                currentDate.setDate(currentDate.getDate() + 7)
              );
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
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  if (loading) {
    return (
      <div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-2">Loading events...</h3>
        <p>Please wait while we load the calendar.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Calendar events={events} />

      <div className="mt-12 bg-white border-2 rounded-md border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-4">Event Color Guide</h3>
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
    </>
  );
};

export default CalendarWithData;
