import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { CommitteeYear } from "@/components/committee-year";
import { Button } from "@/components/ui/button";

export default function HallOfFamePage() {
  // Current committee data
  const currentCommittee = {
    year: "2023-2024",
    members: [
      {
        name: "Yuki Tanaka",
        position: "President",
        image: "/placeholder.svg?height=300&width=300&text=Yuki",
        quote: "Anime brings people together across all boundaries!",
      },
      {
        name: "Alex Chen",
        position: "Vice-President",
        image: "/placeholder.svg?height=300&width=300&text=Alex",
        quote:
          "I'm here to make sure our events are as epic as the anime we watch.",
      },
      {
        name: "Olivia Kim",
        position: "Treasurer",
        image: "/placeholder.svg?height=300&width=300&text=Olivia",
        quote: "Managing our funds so we can have the best anime experiences!",
      },
      {
        name: "Marcus Lee",
        position: "Social Media Secretary",
        image: "/placeholder.svg?height=300&width=300&text=Marcus",
        quote: "Follow us for the latest updates and anime memes!",
      },
      {
        name: "Sophia Patel",
        position: "Events Secretary",
        image: "/placeholder.svg?height=300&width=300&text=Sophia",
        quote: "Planning events that bring our favorite anime to life!",
      },
    ],
  };

  // Past committees data
  const pastCommittees = [
    {
      year: "2022-2023",
      members: [
        {
          name: "Hiroshi Yamamoto",
          position: "President",
          image: "/placeholder.svg?height=300&width=300&text=Hiroshi",
        },
        {
          name: "Emma Wilson",
          position: "Vice-President",
          image: "/placeholder.svg?height=300&width=300&text=Emma",
        },
        {
          name: "David Park",
          position: "Treasurer",
          image: "/placeholder.svg?height=300&width=300&text=David",
        },
        {
          name: "Lily Chen",
          position: "Social Media Secretary",
          image: "/placeholder.svg?height=300&width=300&text=Lily",
        },
        {
          name: "James Rodriguez",
          position: "Events Secretary",
          image: "/placeholder.svg?height=300&width=300&text=James",
        },
      ],
    },
    {
      year: "2021-2022",
      members: [
        {
          name: "Mei Lin",
          position: "President",
          image: "/placeholder.svg?height=300&width=300&text=Mei",
        },
        {
          name: "Thomas Brown",
          position: "Vice-President",
          image: "/placeholder.svg?height=300&width=300&text=Thomas",
        },
        {
          name: "Sarah Johnson",
          position: "Treasurer",
          image: "/placeholder.svg?height=300&width=300&text=Sarah",
        },
        {
          name: "Raj Patel",
          position: "Social Media Secretary",
          image: "/placeholder.svg?height=300&width=300&text=Raj",
        },
        {
          name: "Hannah Kim",
          position: "Events Secretary",
          image: "/placeholder.svg?height=300&width=300&text=Hannah",
        },
      ],
    },
    {
      year: "2020-2021",
      members: [
        {
          name: "Kenji Nakamura",
          position: "President",
          image: "/placeholder.svg?height=300&width=300&text=Kenji",
        },
        {
          name: "Zoe Williams",
          position: "Vice-President",
          image: "/placeholder.svg?height=300&width=300&text=Zoe",
        },
        {
          name: "Michael Chang",
          position: "Treasurer",
          image: "/placeholder.svg?height=300&width=300&text=Michael",
        },
        {
          name: "Aisha Khan",
          position: "Social Media Secretary",
          image: "/placeholder.svg?height=300&width=300&text=Aisha",
        },
        {
          name: "Daniel Lee",
          position: "Events Secretary",
          image: "/placeholder.svg?height=300&width=300&text=Daniel",
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer background="bg-purple-100">
          <div className="mb-4">
            <Button asChild variant="outline" className="border-2 border-black">
              <Link href="/" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <SectionHeading
            badge="LEADERSHIP"
            title="Hall of Fame"
            description="Meet the dedicated individuals who have led our Anime Society through the years. Their passion and hard work have made our community what it is today."
            badgeColor="bg-pink-300"
            className="mb-16"
          />

          <div className="relative">
            {/* Current committee */}
            <div className="relative z-10">
              <CommitteeYear
                year={currentCommittee.year}
                members={currentCommittee.members}
                current={true}
              />
            </div>

            {/* Past committees */}
            <div className="relative z-10 mt-16">
              <div className="mb-12">
                <h2 className="inline-block bg-cyan-300 px-4 py-2 text-2xl font-bold border-4 border-black -rotate-1">
                  PAST COMMITTEES
                </h2>
                <div className="mt-2 h-1 w-full bg-black"></div>
              </div>

              {pastCommittees.map((committee, index) => (
                <CommitteeYear
                  key={index}
                  year={committee.year}
                  members={committee.members}
                />
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-yellow-300 px-4 py-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2">
              <h3 className="text-xl font-bold">Want to join the committee?</h3>
              <p className="mb-4">
                Elections are held at the end of each academic year.
              </p>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Link href="#join">Learn About Positions</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
