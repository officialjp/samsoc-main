import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { CommitteeYear } from "@/components/committee/committee-year";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import {
  TypeCommitteeMemberData,
  TypeCommitteeYearProps,
} from "@/lib/definitions";

// Define the desired order of positions
const positionOrder = [
  "President",
  "Vice-President",
  "Treasurer",
  "Social Media Secretary",
  "Events Secretary",
];

// Function to determine the sort order of a member based on their position
const getPositionOrder = (position: string): number => {
  const index = positionOrder.indexOf(position);
  return index === -1 ? positionOrder.length : index; // Put unknown positions at the end
};

export default async function HallOfFamePage() {
  const supabase = await createClient();

  const { data: allCommittee, error } = await supabase
    .from("committee")
    .select("name, role, image, quote, year")
    .order("year", { ascending: false });

  const members: TypeCommitteeMemberData[] = [];
  allCommittee?.forEach((element) => members.push(element));

  // Get the most recent year to separate current and past committees
  const latestYear = members[0]?.year;

  // Function to format the year as "yyyy-yyyy"
  const formatYearSpan = (year: number | undefined): string => {
    if (year === undefined) {
      return "";
    }
    return `${year - 1}-${year}`;
  };

  // Sort members by position according to the defined order (right to left)
  const sortMembersByPosition = (
    members: TypeCommitteeMemberData[]
  ): TypeCommitteeMemberData[] => {
    return [...members].sort(
      (a, b) => getPositionOrder(a.role) - getPositionOrder(b.role)
    );
  };

  // Current committee data
  const currentCommitteeData = members.filter(
    (member) => member.year === latestYear
  );
  const sortedCurrentCommittee = sortMembersByPosition(currentCommitteeData);
  const currentCommittee: TypeCommitteeYearProps = {
    year: formatYearSpan(latestYear),
    members: sortedCurrentCommittee,
    current: true,
  };

  // Past committees data
  const pastCommitteeData: TypeCommitteeMemberData[] = members.filter(
    (member) => member.year !== latestYear
  );

  // Group past committee members by year
  const pastCommitteesByYear: { [year: number]: TypeCommitteeMemberData[] } =
    {};
  pastCommitteeData.forEach((member) => {
    if (pastCommitteesByYear[member.year]) {
      pastCommitteesByYear[member.year].push(member);
    } else {
      pastCommitteesByYear[member.year] = [member];
    }
  });

  // Convert the grouped data into the format expected by CommitteeYear
  const pastCommittees: TypeCommitteeYearProps[] = Object.entries(
    pastCommitteesByYear
  )
    .sort(([, a], [, b]) => b[0].year - a[0].year) // Sort by year descending
    .map(([year, unsortedMembers]) => ({
      year: formatYearSpan(parseInt(year)),
      members: sortMembersByPosition(unsortedMembers),
    }));

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer>
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
            <div className="relative z-10">
              <CommitteeYear
                year={currentCommittee.year}
                members={currentCommittee.members}
                current={true}
              />
            </div>

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
