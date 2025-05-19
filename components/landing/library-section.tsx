"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "../section-heading";
import { SectionContainer } from "../section-container";
import useIsMobile from "../mobile-check";
import LibraryPhoto from "@/public/images/library-placeholder.webp";

export function LibrarySection() {
  return (
    <SectionContainer id="library">
      <SectionHeading
        badge="MANGA LIBRARY"
        title="Dive Into Our Manga Collection"
        description="Our extensive manga library is one of the exclusive benefits for
              paid members. With hundreds of volumes across various genres,
              there's something for every anime fan!"
        badgeColor="bg-purple-200"
      />
      <div className="flex items-center justify-center mx-auto max-w-7xl py-12 flex-col">
        <div className="relative">
          <div className="overflow-hidden border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {useIsMobile() ? (
              <Image
                src={LibraryPhoto}
                height={200}
                width={360}
                alt={`Gallery image`}
                className="aspect-video object-cover"
              />
            ) : (
              <Image
                src={LibraryPhoto}
                height={360}
                width={640}
                alt={`Gallery image`}
                className="aspect-video object-cover"
              />
            )}
          </div>
          {useIsMobile() ? (
            <div className="absolute -left-4 -bottom-20 bg-white border-2 rounded-md border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">
                Library Stats
              </h3>
              <ul className="space-y-0.5 md:space-y-1">
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  250+ manga volumes
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  25+ different series
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  New volumes added monthly
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  Member requests welcomed
                </li>
              </ul>
            </div>
          ) : (
            <div className="absolute -left-10 -bottom-20 bg-white border-2 border-black p-4 rounded-md md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">
                Library Stats
              </h3>
              <ul className="space-y-0.5 md:space-y-1">
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  250+ manga volumes
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  25+ different series
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  New volumes added monthly
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  Member requests welcomed
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="text-center pt-32">
          <Button className="bg-button2 hover:bg-button1 hover:cursor-pointer text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Link href="/library" className="flex items-center">
              <Library className="mr-2 h-4 w-4" />
              View Full Library
            </Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
