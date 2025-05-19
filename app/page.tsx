import { HeroSection } from "@/components/landing/hero-section";
import { NowStreaming } from "@/components/landing/now-streaming";
import { MembershipSection } from "@/components/landing/membership-section";
import { LibrarySection } from "@/components/landing/library-section";
import { AboutSection } from "@/components/landing/about-section";
import EventsSection from "@/components/landing/events-section";
import GallerySection from "@/components/landing/gallery-section";
import { createClient } from "@/utils/supabase/server";

export default async function AnimeSocietyLanding() {
  const supabase = await createClient();

  const { data: fourEvents } = await supabase
    .from("events")
    .select("id, date, title, description, location")
    .order("date", { ascending: false })
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
      <main className="flex-1">
        <HeroSection />

        <AboutSection />

        <NowStreaming />

        <EventsSection events={fourEvents || []} />

        <LibrarySection />

        <GallerySection />

        <MembershipSection />
      </main>
    </div>
  );
}
