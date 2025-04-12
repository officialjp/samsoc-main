import Image from "next/image";
import Link from "next/link";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LibrarySection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-cyan-100 to-purple-100">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-cyan-300 px-3 py-1 text-sm border-2 border-black">
              MANGA LIBRARY
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Dive Into Our Manga Collection
            </h2>
            <p className="max-w-[700px] text-gray-700 md:text-xl">
              Our extensive manga library is one of the exclusive benefits for
              paid members. With hundreds of volumes across various genres,
              there's something for every anime fan!
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left side - Image and stats */}
          <div className="relative">
            <div className="relative h-[400px] border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Manga+Library"
                alt="Anime Society Manga Library"
                fill
                className="object-cover"
              />
            </div>

            {/* Stats overlay */}
            <div className="absolute -bottom-8 -right-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-3">
              <h3 className="text-xl font-bold mb-2">Library Stats</h3>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-green-500" /> 500+ manga
                  volumes
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-green-500" /> 50+
                  different series
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-green-500" /> New volumes
                  added monthly
                </li>
                <li className="flex items-center text-sm">
                  <Check className="h-4 w-4 mr-2 text-green-500" /> Member
                  requests welcomed
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - Info and rules */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 mr-2" />
              <h3 className="text-2xl font-bold">How It Works</h3>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold mb-2">Membership Benefits</h4>
                <p className="text-gray-700">
                  Paid members get exclusive access to our manga library,
                  allowing you to borrow and enjoy your favorite series at home.
                  It's one of the best perks of joining our society!
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-2">Library Rules</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-yellow-300 text-black font-bold h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      1
                    </span>
                    <p className="text-gray-700">
                      Paid members can borrow up to 3 volumes at a time
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-300 text-black font-bold h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      2
                    </span>
                    <p className="text-gray-700">
                      Borrowing period is 2 weeks, with option to extend if no
                      waiting list
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-300 text-black font-bold h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      3
                    </span>
                    <p className="text-gray-700">
                      Late returns incur a £1 fee per week per volume
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-300 text-black font-bold h-5 w-5 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      4
                    </span>
                    <p className="text-gray-700">
                      Damaged or lost items must be replaced or paid for
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-2">How to Borrow</h4>
                <p className="text-gray-700 mb-4">
                  Browse our online catalog to find what you want, then visit
                  our club room during library hours (Mon & Thu, 2-5PM) to check
                  out your selections. Our librarian will help you!
                </p>

                <Button
                  asChild
                  className="bg-cyan-500 hover:bg-cyan-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Link href="/library" className="flex items-center">
                    Browse Manga Collection{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
