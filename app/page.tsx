import { HeroSection } from "@/components/landing/hero-section";
import { NowStreaming } from "@/components/landing/now-streaming";
import { MembershipSection } from "@/components/landing/membership-section";
import { LibrarySection } from "@/components/landing/library-section";
import { AboutSection } from "@/components/landing/about-section";
import EventsSection from "@/components/landing/events-section";
import GallerySection from "@/components/landing/gallery-section";

export default function AnimeSocietyLanding() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-linear-to-b  from-violet-200 via-pink-200 to-purple-200">
      <main className="flex-1">
        <HeroSection />

        <AboutSection />

        <NowStreaming />

        <EventsSection />

        <LibrarySection />

        <GallerySection />

        <MembershipSection />
      </main>
    </div>
  );
}
