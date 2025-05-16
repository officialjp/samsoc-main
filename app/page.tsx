import Image from "next/image";
import {
  Calendar,
  Users,
  Star,
  ImageIcon,
  ListIcon,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { EventCard } from "@/components/event-card";
import { NowStreaming } from "@/components/now-streaming";
import { MembershipSection } from "@/components/membership-section";
import { LibrarySection } from "@/components/library-section";

export default function AnimeSocietyLanding() {
  const features = [
    {
      icon: Calendar,
      title: "Weekly Screenings",
      description:
        "Join us every Wednesday for anime screenings. From classics to the latest releases!",
      color: "bg-cyan-300",
    },
    {
      icon: Users,
      title: "Community Events",
      description:
        "Come and hang out with us at one of the multitude of events we run!",
      color: "bg-pink-300",
    },
    {
      icon: Star,
      title: "Convention Trips",
      description:
        "We organize group trips to both the November and May MCM ComiCon conventions!",
      color: "bg-yellow-300",
    },
  ];

  const events = [
    {
      date: "June 6",
      title: "Karaoke Night",
      description:
        "Come jam out with us on stage to a list of anime songs suggested by our members!",
      location: "Wates Green Room",
    },
    {
      date: "N/A",
      title: "N/A",
      description: "N/A",
      location: "N/A",
    },
    {
      date: "N/A",
      title: "N/A",
      description: "N/A",
      location: "N/A",
    },
    {
      date: "N/A",
      title: "N/A",
      description: "N/A",
      location: "N/A",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col w-full bg-linear-to-b from-cyan-200 via-pink-200 to-purple-200">
      <main className="flex-1">
        <HeroSection />

        <SectionContainer id="about" background="">
          <SectionHeading
            badge="ABOUT US"
            title="What We're All About"
            description="We're a society for all people that love or are interested in the medium of anime. Everyone is welcome!"
            badgeColor="bg-yellow-300"
          />
          <div className="mx-auto max-w-7xl items-center gap-6 py-12 grid lg:grid-cols-3 lg:gap-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </SectionContainer>

        <SectionContainer id="events" background="">
          <SectionHeading
            badge="CALENDAR"
            title="Upcoming Events"
            description="Check out what's coming up and mark your calendars! All events are open to members and sometimes guests too."
            badgeColor="bg-pink-300"
          />
          <div className="mx-auto max-w-7xl gap-8 py-12 grid lg:grid-cols-2">
            {events.map((event, index) => (
              <EventCard
                key={index}
                date={event.date}
                title={event.title}
                description={event.description}
                location={event.location}
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              asChild
              className="bg-pink-300 hover:bg-pink-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Link href="/events" className="flex items-center">
                <ListIcon className="mr-2 h-4 w-4" />
                See All Event Types
              </Link>
            </Button>

            <Button
              asChild
              className="bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Link href="/calendar" className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Full Calendar
              </Link>
            </Button>
          </div>
        </SectionContainer>

        <NowStreaming />

        <LibrarySection />

        <SectionContainer id="gallery" background="">
          <SectionHeading
            badge="MEMORIES"
            title="Our Gallery"
            description="Highlights from our many past events!"
            badgeColor="bg-cyan-300"
          />
          <div className="mx-auto max-w-7xl gap-6 py-12 grid md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=Anime+Event+${i}`}
                  width={400}
                  height={300}
                  alt={`Gallery image ${i}`}
                  className="aspect-video object-cover transition-all hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              asChild
              className="bg-cyan-300 hover:bg-cyan-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Link href="/gallery" className="flex items-center">
                <ImageIcon className="mr-2 h-4 w-4" />
                View Full Gallery
              </Link>
            </Button>
          </div>
        </SectionContainer>

        <MembershipSection />
      </main>
    </div>
  );
}
