"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { parseISO, addDays, addWeeks } from "date-fns";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { Calendar } from "@/components/calendar/calendar";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  // Current date for generating recurring events
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Find the next Friday for regular sessions
  const getNextFriday = (from = new Date()) => {
    const dayOfWeek = from.getDay();
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 5 + 7 - dayOfWeek;
    return addDays(from, daysUntilFriday);
  };

  // Generate weekly anime sessions for the next 3 months
  const generateWeeklySessions = () => {
    const sessions = [];
    let nextFriday = getNextFriday();

    // Current anime being streamed
    const currentAnime = [
      {
        title: "Demon Slayer",
        episode: "Season 2, Episode 5",
        description:
          "Tanjiro and the Sound Hashira face off against powerful demons in the Entertainment District.",
      },
      {
        title: "My Hero Academia",
        episode: "Season 6, Episode 12",
        description:
          "The heroes continue their battle against the Paranormal Liberation Front.",
      },
      {
        title: "Spy x Family",
        episode: "Season 1, Episode 8",
        description:
          "Anya prepares for her first day at the prestigious Eden Academy.",
      },
    ];

    // Generate 12 weekly sessions (3 months)
    for (let i = 0; i < 12; i++) {
      const animeIndex = i % 3; // Cycle through the 3 anime
      const episodeNumber =
        Math.floor(i / 3) +
        Number.parseInt(currentAnime[animeIndex].episode.split("Episode ")[1]);

      sessions.push({
        id: `weekly-${i}`,
        title: `Weekly Anime: ${currentAnime[animeIndex].title}`,
        description: `${currentAnime[animeIndex].title} ${
          currentAnime[animeIndex].episode.split(",")[0]
        }, Episode ${episodeNumber}. ${currentAnime[animeIndex].description}`,
        location: "Student Union, Room 302",
        date: nextFriday,
        color: "bg-purple-200",
        isRegularSession: true,
      });

      // Move to next Friday
      nextFriday = addWeeks(nextFriday, 1);
    }

    return sessions;
  };

  // Sample events data
  const events = [
    {
      id: "1",
      title: "Anime Movie Night",
      description:
        "Screening of 'Your Name' followed by discussion about themes and animation techniques.",
      location: "Student Union, Room 302",
      date: parseISO("2023-04-15"),
      color: "bg-pink-200",
    },
    {
      id: "2",
      title: "Manga Drawing Workshop",
      description:
        "Learn manga drawing basics with professional artist. Materials will be provided.",
      location: "Arts Building, Studio 5",
      date: parseISO("2023-04-22"),
      color: "bg-cyan-200",
    },
    {
      id: "3",
      title: "Spring Cosplay Contest",
      description:
        "Show off your best cosplay and win prizes! Categories include Best Craftsmanship, Most Accurate, and Audience Favorite.",
      location: "Main Hall",
      date: parseISO("2023-05-05"),
      color: "bg-yellow-200",
    },
    {
      id: "4",
      title: "AnimeConvention Trip",
      description:
        "Group trip to the annual AnimeConvention. Discounted tickets available for members.",
      location: "City Convention Center",
      date: parseISO("2023-05-20"),
      color: "bg-green-200",
    },
    {
      id: "5",
      title: "Karaoke Night",
      description:
        "Sing your favorite anime openings and endings! Prizes for best performance.",
      location: "Student Bar",
      date: parseISO("2023-04-28"),
      color: "bg-purple-200",
    },
    {
      id: "6",
      title: "Anime Quiz Night",
      description:
        "Test your anime knowledge in teams of 3-5. Prizes for the winning team!",
      location: "Student Union, Room 101",
      date: parseISO("2023-05-12"),
      color: "bg-orange-200",
    },
    {
      id: "7",
      title: "Art Society Collaboration",
      description:
        "Joint workshop on anime art styles and techniques with the University Art Society.",
      location: "Arts Building, Main Studio",
      date: parseISO("2023-05-15"),
      color: "bg-blue-200",
    },
    {
      id: "8",
      title: "End of Term Party",
      description:
        "Celebrate the end of term with food, drinks, and anime-themed games!",
      location: "Student Union Bar",
      date: parseISO("2023-06-10"),
      color: "bg-red-200",
    },
    {
      id: "9",
      title: "Committee Meeting",
      description:
        "Monthly meeting to plan upcoming events. All members welcome to attend and provide input.",
      location: "Student Union, Room 203",
      date: parseISO("2023-04-10"),
      color: "bg-gray-200",
    },
    {
      id: "10",
      title: "Anime Merchandise Swap",
      description:
        "Bring anime merchandise you'd like to trade with other members.",
      location: "Student Union, Main Hall",
      date: parseISO("2023-05-25"),
      color: "bg-indigo-200",
    },
  ];

  // Add some events for the current month
  const currentMonthEvents = [
    {
      id: "current-1",
      title: "Manga Club Meeting",
      description:
        "Discussion of this month's selected manga series. New members welcome!",
      location: "Library, Meeting Room 2",
      date: new Date(currentYear, currentMonth, currentDate.getDate() + 5),
      color: "bg-cyan-200",
    },
    {
      id: "current-2",
      title: "Japanese Snack Tasting",
      description:
        "Try a variety of Japanese snacks and drinks while watching anime!",
      location: "Student Union, Room 101",
      date: new Date(currentYear, currentMonth, currentDate.getDate() + 10),
      color: "bg-yellow-200",
    },
  ];

  // Get weekly anime sessions
  const weeklySessions = generateWeeklySessions();

  // Combine all events
  const allEvents = [...events, ...currentMonthEvents, ...weeklySessions];

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

          <div className="mt-12 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-4">Event Color Guide</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-200 border border-black mr-2"></div>
                <span>Weekly Anime Screenings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-200 border border-black mr-2"></div>
                <span>Special Screenings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-cyan-200 border border-black mr-2"></div>
                <span>Workshops</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-200 border border-black mr-2"></div>
                <span>Contests</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 border border-black mr-2"></div>
                <span>Trips</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-200 border border-black mr-2"></div>
                <span>Competitions</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-200 border border-black mr-2"></div>
                <span>Collaborations</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-200 border border-black mr-2"></div>
                <span>Parties</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 border border-black mr-2"></div>
                <span>Meetings</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-200 border border-black mr-2"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
