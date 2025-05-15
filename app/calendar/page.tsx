"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { parseISO, addDays, addWeeks } from "date-fns";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { Calendar } from "@/components/calendar/calendar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function CalendarPage() {
  // Current date for generating recurring events
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Find the next Friday for regular sessions
  // const getNextFriday = (from = new Date()) => {
  //   const dayOfWeek = from.getDay();
  //   const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + 7 - dayOfWeek;
  //   return addDays(from, daysUntilFriday);
  // };

  // Generate weekly anime sessions for the next 3 months
  // const generateWeeklySessions = () => {
  //   const sessions = [];
  //   let nextFriday = getNextFriday();

  //   // Current anime being streamed
  //   const currentAnime = [
  //     {
  //       title: "Demon Slayer",
  //       episode: "Season 2, Episode 5",
  //       description:
  //         "Tanjiro and the Sound Hashira face off against powerful demons in the Entertainment District.",
  //     },
  //     {
  //       title: "My Hero Academia",
  //       episode: "Season 6, Episode 12",
  //       description:
  //         "The heroes continue their battle against the Paranormal Liberation Front.",
  //     },
  //     {
  //       title: "Spy x Family",
  //       episode: "Season 1, Episode 8",
  //       description:
  //         "Anya prepares for her first day at the prestigious Eden Academy.",
  //     },
  //   ];

  //   // Generate 12 weekly sessions (3 months)
  //   for (let i = 0; i < 12; i++) {
  //     const animeIndex = i % 3; // Cycle through the 3 anime
  //     const episodeNumber =
  //       Math.floor(i / 3) +
  //       Number.parseInt(currentAnime[animeIndex].episode.split("Episode ")[1]);

  //     sessions.push({
  //       id: `weekly-${i}`,
  //       title: `Weekly Anime: ${currentAnime[animeIndex].title}`,
  //       description: `${currentAnime[animeIndex].title} ${
  //         currentAnime[animeIndex].episode.split(",")[0]
  //       }, Episode ${episodeNumber}. ${currentAnime[animeIndex].description}`,
  //       location: "Student Union, Room 302",
  //       date: parseISO("2025-09-" + nextFriday.getDay),
  //       color: "bg-purple-200",
  //       isRegularSession: true,
  //     });

  //     // Move to next Friday
  //     nextFriday = addWeeks(nextFriday, 1);
  //   }

  //   return sessions;
  // };

  // Sample events data
  const events = [
    {
      id: "1",
      title: "Karaoke Night",
      description:
        "Come jam out with us on stage to a list of anime songs suggested by our members!",
      location: "Wates Green Room",
      date: parseISO("2025-06-06"),
      color: "bg-pink-200",
    },
  ];


  // Get weekly anime sessions
  // const weeklySessions = generateWeeklySessions();

  // Combine all events add ...weeklySessions to this once that is done
  const allEvents = [...events];

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer background="bg-purple-50">
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

          <div className="mt-12 bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-4">Event Color Guide</h3>
            <div
              className={`grid gap-4 ${
                isMobile
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              }`}
            >
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
