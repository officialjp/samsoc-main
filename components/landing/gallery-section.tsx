"use client";
import SwipeRight from "@/public/hand-swipe-right.svg";
import { SectionContainer } from "../section-container";
import { SectionHeading } from "../section-heading";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import useIsMobile from "../mobile-check";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ImageIcon } from "lucide-react";

export default function GallerySection() {
  if (useIsMobile()) {
    return (
      <SectionContainer id="gallery">
        <SectionHeading
          badge="MEMORIES"
          title="Our Gallery"
          description="Highlights from our many past events!"
          badgeColor="bg-purple-200"
        />
        <div className="mx-auto max-w-7xl gap-6 py-12 flex justify-center items-center">
          <Carousel className="w-full max-w-[500] ">
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-[10px]">
                    <div
                      key={index}
                      className="overflow-hidden border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="relative flex items-center">
                        <Image
                          src={`/placeholder.svg?height=300&width=400&text=Anime+Event+${index}`}
                          width={400}
                          height={300}
                          alt={`Gallery image ${index}`}
                          className="aspect-video object-cover"
                        />
                        <Image
                          alt="icon"
                          className="lg:hidden absolute bottom-1 right-1"
                          src={SwipeRight}
                          height={20}
                          width={20}
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <Button className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Link href="/gallery" className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              View Full Gallery
            </Link>
          </Button>
        </div>
      </SectionContainer>
    );
  } else {
    return (
      <SectionContainer id="gallery">
        <SectionHeading
          badge="MEMORIES"
          title="Our Gallery"
          description="Highlights from our many past events!"
          badgeColor="bg-purple-200"
        />
        <div className="mx-auto max-w-7xl gap-6 py-12 grid md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="overflow-hidden border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
          <Button className="bg-button2 hover:bg-button1 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Link href="/gallery" className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              View Full Gallery
            </Link>
          </Button>
        </div>
      </SectionContainer>
    );
  }
}
