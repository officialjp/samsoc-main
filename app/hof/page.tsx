import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import HallOfFameContent from "@/components/hof-content";

export default function HallOfFamePage() {
  return (
    <div className="flex min-h-screen flex-col w-full bg-gradient-to-b from-bg1 to-bg2">
      <main className="flex-1">
        <SectionContainer>
          <div className="mb-4">
            <Button
              asChild
              variant="outline"
              className="border-2 bg-button2 hover:bg-button1 border-black"
            >
              <Link href="/" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <SectionHeading
            badge="LEADERSHIP"
            title="Hall of Fame"
            description="Meet the dedicated individuals who have led our Anime Society through the years. Their passion and hard work have made our community what it is today."
            badgeColor="bg-purple-200"
            className="mb-16"
          />

          <HallOfFameContent />

          <div className="mt-16 text-center">
            <div className="inline-block bg-white px-4 py-3 border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-2">
              <h3 className="text-xl font-bold">Want to join the committee?</h3>
              <p className="mb-4">
                Elections are held at the end of each academic year.
              </p>
              <Button className="bg-button2 hover:bg-button1 text-text1 border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Link href="#join">Learn About Positions</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
