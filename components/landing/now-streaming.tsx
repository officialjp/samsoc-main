"use client";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/landing/anime-card";
import Link from "next/link";
import useIsMobile from "../mobile-check";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const currentAnime = [
  {
    title: "Death Parade",
    episode: "Finished",
    description:
      "After death, some souls go to Quindecim wher arbiter Decim judges them through death games for reincarnation or the void.",
    image: "/placeholder.svg?height=250&width=180&text=Demon+Slayer",
  },
  {
    title: "Tomo-Chan is a girl",
    episode: "Finished",
    description:
      "Tomboy Tomo is in love with her best friend Jun, but he sees her as a brother. She tries to make him see her romantically.",
    image: "/placeholder.svg?height=250&width=180&text=My+Hero+Academia",
  },
  {
    title: "Fire Force",
    episode: "Season 1 Finished",
    description:
      "Spontaneous Human Combustion causes Infernals; pyrokinetics can control fire. The Special Fire Force fights Infernals and seeks the cause.",
    image: "/placeholder.svg?height=250&width=180&text=Spy+x+Family",
  },
];

export function NowStreaming() {
  if (useIsMobile()) {
    return (
      <SectionContainer
        id="now-streaming"
        className="w-full py-12 md:py-16 overflow-hidden"
      >
        <SectionHeading
          badge="NOW STREAMING"
          title="This Week's Anime"
          description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly
              anime screenings!"
          badgeColor="bg-purple-200"
        />
        <div className="mx-auto max-w-7xl gap-8 py-12 ">
          <div className="mx-auto max-w-7xl gap-6 flex justify-center items-center">
            <Carousel className="w-full lg:max-w-[500]">
              <CarouselContent>
                {currentAnime.map((anime, index) => (
                  <CarouselItem key={index}>
                    <div className="p-[10px]">
                      <div className="relative flex items-center">
                        {index != 0 && (
                          <ChevronLeft className="absolute text-gray-500 left-2 top-1/2 -translate-y-1/2" />
                        )}
                        <AnimeCard
                          key={index}
                          title={anime.title}
                          episode={anime.episode}
                          description={anime.description}
                          image={anime.image}
                        />
                        {index != 2 && (
                          <ChevronRight className="absolute text-gray-500 right-2 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="mt-8 text-center">
            <p className="font-medium mb-4">
              Don't worry if you've missed previous episodes - you have plenty
              of time to catch-up!
            </p>
            <Button
              asChild
              className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Link href="/calendar" className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Full Calendar
              </Link>
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }
  return (
    <SectionContainer id="now-streaming">
      <SectionHeading
        badge="NOW STREAMING"
        title="This Week's Anime"
        description="Join us every Wednesday at 6PM in Lecture Theatre G for our weekly
              anime screenings!"
        badgeColor="bg-purple-200"
      />
      <div className="container w-full max-w-full py-8 px-8">
        <div className="relative mx-auto max-w-7xl p-4 ">
          <div className="grid gap-8 md:grid-cols-3">
            {currentAnime.map((anime, index) => (
              <AnimeCard
                key={index}
                title={anime.title}
                episode={anime.episode}
                description={anime.description}
                image={anime.image}
              />
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="font-medium mb-4 text-text1">
            Don't worry if you've missed previous episodes - you have plenty of
            time to catch-up!
          </p>
          <Button
            asChild
            className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Link href="/calendar" className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              View Full Calendar
            </Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
