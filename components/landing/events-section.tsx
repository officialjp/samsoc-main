"use client";
import { useState, useEffect } from "react";
import { EventCard } from "./event-card";
import useIsMobile from "../mobile-check";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { createClient } from "@/utils/supabase/client";

interface EventsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  location: string;
}

export function EventsContent() {
  const [events, setEvents] = useState<EventsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { data: fourEvents, error: fetchError } = await supabase
          .from("events")
          .select("id, date, title, description, location")
          .order("date", { ascending: false })
          .limit(4);

        if (fetchError) {
          setError(`Error fetching events: ${fetchError.message}`);
          return;
        }

        const formatDate = (inputDate: string): string => {
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
          } catch (err: any) {
            console.error("Error formatting date:", err);
            return "null";
          }
        };

        const formattedEvents = fourEvents?.map((event) => ({
          id: event.id,
          date: formatDate(event.date),
          title: event.title,
          description: event.description,
          location: event.location,
        })) as EventsItem[];

        setEvents(formattedEvents);
      } catch (err: any) {
        setError(`An unexpected error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-2">Loading upcoming events...</h3>
        <p>Please wait while we fetch the schedule.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading events: {error}</div>;
  }

  if (isMobile) {
    return (
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
    );
  } else {
    return (
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
    );
  }
}
