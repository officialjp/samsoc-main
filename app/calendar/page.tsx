import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { parseISO, addDays, addWeeks } from "date-fns";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { Calendar } from "@/components/calendar/calendar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { CalendarEventType } from "@/lib/definitions";

export default async function CalendarPage() {
  function addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select()
    .eq("isregularsession", false);

  const { data: regSession } = await supabase
    .from("events")
    .select()
    .eq("isregularsession", true);

  const generateWeeklySession = (): CalendarEventType[] => {
    const sessions: CalendarEventType[] = [];

    regSession?.forEach((session) => {
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
        currentDate = addDays(currentDate, 7);
      }
    });

    return sessions;
  };

  const weeklySessions = generateWeeklySession();
  const allEvents = [...(events as []), ...weeklySessions];

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer>
          <div className="mb-4">
            <Button asChild variant="outline" className="border-2 border-black">
              <Link href="/" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <SectionHeading
            badge="SCHEDULE"
            title="Event Calendar"
            description="Browse our upcoming events and regular anime screenings. Click on any event for more details!"
            badgeColor="bg-pink-300"
            className="mb-12"
          />

          <Calendar events={allEvents} />

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
        </SectionContainer>
      </main>
    </div>
  );
}
