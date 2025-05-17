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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        badgeColor="bg-yellow-200"
      />
      <div className="mx-auto max-w-7xl gap-8 py-12 ">
        <div className="relative mx-auto max-w-2xl border-4 md:border-8 border-black bg-white p-4 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="mx-auto max-w-7xl gap-6 flex justify-center items-center">
            <Carousel className="w-full lg:max-w-[500]">
              <CarouselContent>
                {currentAnime.map((anime, index) => (
                  <CarouselItem key={index}>
                    <div className="p-[10px]">
                      <AnimeCard
                        key={index}
                        title={anime.title}
                        episode={anime.episode}
                        description={anime.description}
                        image={anime.image}
                      />
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
          <div className="mt-8 text-center">
            <p className="font-medium mb-4">
              Don't worry if you've missed previous episodes - you have plenty
              of time to catch-up!
            </p>
            <Button
              asChild
              className="bg-purple-500 hover:bg-purple-600 text-white border border-black md:border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm md:text-base"
            >
              <Link href="/calendar">View Full Schedule</Link>
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
