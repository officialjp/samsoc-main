"use client";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import useIsMobile from "../mobile-check";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";

export default function GallerySection() {
  return (
    <SectionContainer id="gallery">
      <SectionHeading
        badge="MEMORIES"
        title="Our Gallery"
        description="Highlights from our many past events!"
        badgeColor="bg-yellow-200"
      />
      <div className="mx-auto max-w-7xl gap-6 py-12 flex justify-center items-center">
        <Carousel className="w-full max-w-[500] ">
          <CarouselContent>
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-[10px]">
                  <div
                    key={index}
                    className="overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="relative flex items-center">
                      {useIsMobile() && index != 0 && (
                        <ChevronLeft className="absolute text-gray-500 -left-2 top-1/2 -translate-y-1/2" />
                      )}
                      <Image
                        src={`/placeholder.svg?height=300&width=400&text=Anime+Event+${index}`}
                        width={400}
                        height={300}
                        alt={`Gallery image ${index}`}
                        className="aspect-video object-cover"
                      />
                      {useIsMobile() && index != 5 && (
                        <ChevronRight className="absolute text-gray-500 -right-2 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {!useIsMobile() && (
            <>
              <CarouselPrevious /> <CarouselNext />
            </>
          )}
        </Carousel>
      </div>

      <div className="text-center mt-8">
        <Button className="bg-cyan-300 hover:bg-cyan-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/gallery" className="flex items-center">
            <ImageIcon className="mr-2 h-4 w-4" />
            View Full Gallery
          </Link>
        </Button>
      </div>
    </SectionContainer>
  );
}
