import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-linear-to-t from-purple-100 to-pink-200">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                <span className="bg-cyan-300 px-2 py-1 rotate-1 inline-block border-2 border-black">
                  ANIME
                </span>{" "}
                <span className="bg-yellow-300 px-2 py-1 -rotate-2 inline-block border-2 border-black">
                  LOVERS
                </span>{" "}
                <span className="block mt-2">UNITE!</span>
              </h1>
              <p className="max-w-[600px] text-gray-700 md:text-xl">
                Join our vibrant community of anime enthusiasts at Surrey.{" "}
                <br />
                Watch together, cosplay, discuss, and make friends who share
                your passion!
              </p>
            </div>
            {/* Button Container with Flex Layout */}
            <div className="flex flex-col items-start gap-4 mt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Join Now Button */}
                <Button
                  asChild
                  className="bg-pink-500 hover:bg-pink-600 text-white text-lg py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse"
                >
                  <Link
                    href="#join"
                    className="flex items-center justify-center whitespace-nowrap"
                  >
                    <span className="mr-2">🎉</span> Join Now{" "}
                  </Link>
                </Button>

                {/* Upcoming Events Button */}
                <Button
                  asChild
                  variant="outline"
                  className="bg-yellow-300 hover:bg-yellow-400 text-black text-lg py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Link
                    href="#events"
                    className="flex items-center justify-center whitespace-nowrap"
                  >
                    <span className="mr-2">📅</span> Upcoming Events
                  </Link>
                </Button>
              </div>

              {/* Hall of Fame Button */}
              <Button
                asChild
                className="group relative overflow-hidden bg-cyan-300 hover:bg-cyan-400 text-black text-lg py-4 px-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Link
                  href="/hof"
                  className="flex items-center justify-center whitespace-nowrap"
                >
                  <div className="absolute -left-10 top-0 h-full w-20 bg-white/20 transform rotate-12 translate-x-0 group-hover:translate-x-[300px] transition-transform duration-700"></div>
                  <Trophy className="mr-2 h-5 w-5" />
                  <span className="font-bold">Meet Our Committee</span>
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="/images/samchan-1.png"
            width={500}
            height={500}
            alt="Anime Society Members"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2"
          />
        </div>
      </div>
    </section>
  );
}
