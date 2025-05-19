import { HeroSection } from "@/components/landing/hero-section";
import { NowStreaming } from "@/components/landing/now-streaming";
import { MembershipSection } from "@/components/landing/membership-section";
import { LibrarySection } from "@/components/landing/library-section";
import { AboutSection } from "@/components/landing/about-section";
import EventsSection from "@/components/landing/events-section";
import GallerySection from "@/components/landing/gallery-section";
import { createClient } from "@/utils/supabase/server";

function formatDate(inputDate: string): string {
  try {
    const dateParts = inputDate.split("-");
    if (dateParts.length !== 3) {
      return "null"; // Invalid input format
    }

    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const day = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayWithSuffix = (day: number): string => {
      if (day >= 11 && day <= 13) {
        return `${day}th`;
      }
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };

    const formattedMonth = monthNames[date.getMonth()];
    const formattedDay = dayWithSuffix(date.getDate());

    return `${formattedMonth} ${formattedDay}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "null";
  }
}

export default async function AnimeSocietyLanding() {
  const supabase = await createClient();

  const { data: fourEvents } = await supabase
    .from("events")
    .select("id, date, title, description, location")
    .order("date", { ascending: false })
    .limit(4);

  const formattedEvents = fourEvents?.map((event) => ({
    id: event.id,
    date: formatDate(event.date),
    title: event.title,
    description: event.description,
    location: event.location,
  }));

  const { data: galleryData } = await supabase
    .from("gallery")
    .select("id, public_url, alt")
    .limit(6);

  const { data: regularData } = await supabase
    .from("regular")
    .select("title, public_url, episode, description, id");

  return (
    <div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
      <main className="flex-1">
        <HeroSection />

        <AboutSection />

        <NowStreaming animes={regularData || []} />

        <EventsSection events={formattedEvents || []} />

        <LibrarySection />

        <GallerySection images={galleryData || []} />

        <MembershipSection />
      </main>
    </div>
  );
}
