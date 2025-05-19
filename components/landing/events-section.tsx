"use client";
import { ListIcon } from "lucide-react";
import { EventCard } from "./event-card";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { Button } from "../ui/button";
import Link from "next/link";
import useIsMobile from "../mobile-check";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

interface EventsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  location: string;
}

interface EventsData {
  events: EventsItem[];
}

export default function EventsSection({ events }: EventsData) {
  if (useIsMobile()) {
    return (
      <SectionContainer id="events">
        <SectionHeading
          badge="CALENDAR"
          title="Upcoming Events"
          description="Check out what's coming up and mark your calendars! All events are open to members and sometimes guests too."
          badgeColor="bg-purple-200"
        />
        <div className="mx-auto max-w-7xl gap-8 py-12">
          <div className="w-full flex-col items-center gap-4 flex">
            <Carousel className="w-full lg:max-w-[500]">
              <CarouselContent>
                {events.map((event) => (
                  <CarouselItem key={event.id}>
                    <div className="p-[10px]">
                      <EventCard
                        id={event.id}
                        date={event.date}
                        location={event.location}
                        description={event.description}
                        title={event.title}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <div className="flex items-center justify-center flex-col gap-4 mt-8">
          <Button
            asChild
            className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Link href="/events" className="flex items-center">
              <ListIcon className="mr-2 h-4 w-4" />
              See All Event Types
            </Link>
          </Button>
        </div>
      </SectionContainer>
    );
  } else {
    return (
      <SectionContainer id="events">
        <SectionHeading
          badge="CALENDAR"
          title="Upcoming Events"
          description="Check out what's coming up and mark your calendars! All events are open to members and sometimes guests too."
          badgeColor="bg-purple-200"
        />
        <div className="mx-auto max-w-7xl gap-8 py-12 grid lg:grid-cols-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              date={event.date}
              description={event.description}
              location={event.location}
              title={event.title}
            />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            asChild
            className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Link href="/events" className="flex items-center">
              <ListIcon className="mr-2 h-4 w-4" />
              See All Event Types
            </Link>
          </Button>
        </div>
      </SectionContainer>
    );
  }
}
