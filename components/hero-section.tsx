import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-8 pt-10 sm:py-12 md:py-20 lg:py-32 bg-gradient-to-b from-purple-200 via-pink-200 to-white">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 md:gap-8 lg:gap-12 lg:grid-cols-2 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter">
                <span className="bg-cyan-300 px-2 py-1 rotate-1 inline-block border-2 border-black">
                  ANIME
                </span>{" "}
                <span className="bg-yellow-300 px-2 py-1 -rotate-2 inline-block border-2 border-black">
                  LOVERS
                </span>{" "}
                <span className="block mt-2">UNITE!</span>
              </h1>
              <p className="max-w-full sm:max-w-[600px] text-base sm:text-lg md:text-xl text-gray-700">
                Join our vibrant community of anime enthusiasts at Surrey.{" "}
                <span className="hidden sm:inline">
                  <br />
                </span>
                Watch together, cosplay, discuss, and make friends who share
                your passion!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6">
              <Button
                asChild
                className="bg-pink-500 hover:bg-pink-600 text-white text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-7 px-4 sm:px-6 md:px-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
              >
                <Link href="#join" className="flex items-center justify-center">
                  <span className="mr-2">🎉</span> Join Now{" "}
                  <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-yellow-300 hover:bg-yellow-400 text-black text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-7 px-4 sm:px-6 md:px-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Link
                  href="#events"
                  className="flex items-center justify-center"
                >
                  <span className="mr-2">📅</span> Upcoming Events
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-8 lg:mt-0">
            <Image
              src="/placeholder.svg?height=500&width=500"
              width={500}
              height={500}
              alt="Anime Society Members"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square overflow-hidden rounded-xl object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
