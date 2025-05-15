import Image from "next/image";
import Link from "next/link";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LibrarySection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-cyan-100 to-purple-100 overflow-hidden">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-cyan-300 px-3 py-1 text-sm border-2 border-black">
              MANGA LIBRARY
            </div>
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl">
              Dive Into Our Manga Collection
            </h2>
            <p className="max-w-[700px] text-gray-700 text-sm sm:text-base md:text-xl">
              Our extensive manga library is one of the exclusive benefits for
              paid members. With hundreds of volumes across various genres,
              there's something for every anime fan!
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side - Image and stats */}
          <div className="relative">
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] border-4 sm:border-6 md:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Manga+Library"
                alt="Anime Society Manga Library"
                fill
                className="object-cover"
              />
            </div>

            {/* Stats overlay - Adjusted for mobile */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-white border-2 sm:border-4 border-black p-2 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2">
                Library Stats
              </h3>
              <ul className="space-y-0.5 md:space-y-1">
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  500+ manga volumes
                </li>
                <li className="flex items-center text-xs sm:text-sm">
                  <Check className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-green-500" />{" "}
                  50+ different series
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
          </div>

          {/* Right side - Info and rules */}
          <div className="bg-white border-2 sm:border-4 border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-3 md:mb-4">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 mr-2" />
              <h3 className="text-xl md:text-2xl font-bold">How It Works</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <h4 className="text-base md:text-lg font-bold mb-1 md:mb-2">
                  Membership Benefits
                </h4>
                <p className="text-gray-700 text-sm sm:text-base">
                  Paid members get exclusive access to our manga library,
                  allowing you to borrow and enjoy your favorite series at home.
                  It's one of the best perks of joining our society!
                </p>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-bold mb-1 md:mb-2">
                  Library Rules
                </h4>
                <ul className="space-y-1 md:space-y-2">
                  <li className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <span className="flex items-center justify-center bg-yellow-300 text-black font-bold rounded-full w-6 h-6 text-sm">
                        1
                      </span>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <p className="text-gray-700 text-sm sm:text-base">
                        Paid members can borrow as many volumes as they like as
                        long as your deposit covers them.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <span className="flex items-center justify-center bg-yellow-300 text-black font-bold rounded-full w-6 h-6 text-sm">
                        2
                      </span>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <p className="text-gray-700 text-sm sm:text-base">
                        Borrowing period can go on for as long as you want,
                        until another member requests the same manga, if so you
                        must return it by 1 week. All manga to be returned at
                        the end of the year.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <span className="flex items-center justify-center bg-yellow-300 text-black font-bold rounded-full w-6 h-6 text-sm">
                        3
                      </span>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <p className="text-gray-700 text-sm sm:text-base">
                        If a manga is returned in a state that is noticeably
                        worse than the condition it was been handed out in, your
                        deposit will be used to cover damages.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <span className="flex items-center justify-center bg-yellow-300 text-black font-bold rounded-full w-6 h-6 text-sm">
                        4
                      </span>
                    </div>
                    <div className="flex-grow pt-0.5">
                      <p className="text-gray-700 text-sm sm:text-base">
                        We charge a £5-10 deposit on each manga to cover losses
                        or damages incurred to them. You will get the deposit
                        back once you return the manga.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-base md:text-lg font-bold mb-1 md:mb-2">
                  How to Borrow
                </h4>
                <p className="text-gray-700 text-sm sm:text-base mb-3 md:mb-4">
                  Browse our online catalog to find what you want, then request
                  the manga from committee and come to the Wednesday session
                  at 6PM where you can pick-up the requested manga.
                </p>

                <Button
                  asChild
                  className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white text-sm sm:text-base border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Link
                    href="/library"
                    className="flex items-center justify-center"
                  >
                    Browse Manga Collection{" "}
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
