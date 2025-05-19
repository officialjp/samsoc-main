import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import LibraryContent from "@/components/library/library-client";

export default function LibraryPage() {
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
            badge="MANGA"
            title="Our Library"
            description="Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks."
            badgeColor="bg-purple-200"
            className="mb-8"
          />

          <LibraryContent />
        </SectionContainer>
      </main>
    </div>
  );
}
