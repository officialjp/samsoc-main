"use client";
import {
  ListIcon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EventCard } from "./event-card";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { Button } from "../ui/button";
import Link from "next/link";
import useIsMobile from "../mobile-check";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

export default function EventsSection() {
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
    <SectionContainer id="events">
      <SectionHeading
        badge="CALENDAR"
        title="Upcoming Events"
        description="Check out what's coming up and mark your calendars! All events are open to members and sometimes guests too."
        badgeColor="bg-yellow-200"
      />
      <div className="mx-auto max-w-7xl gap-8 py-12">
        <div className="w-full flex-col items-center gap-4 flex">
          <Carousel className="w-full lg:max-w-[500]">
            <CarouselContent>
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-[10px]">
                    <EventCard {...events[index]} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!useIsMobile() ? (
              <>
                <CarouselPrevious /> <CarouselNext />
              </>
            ) : (
              <>
                <div className="absolute inset-y-0 left-2 flex items-center">
                  <ChevronLeft className="text-gray-400 text-lg" />
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <ChevronRight className="text-gray-400 text-lg" />
                </div>
              </>
            )}
          </Carousel>
        </div>
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
  );
}
