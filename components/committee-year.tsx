import { CommitteeMember } from "./committee-card";

interface CommitteeMemberData {
  name: string;
  position: string;
  image: string;
  quote?: string;
}

interface CommitteeYearProps {
  year: string;
  members: CommitteeMemberData[];
  current?: boolean;
}

export function CommitteeYear({
  year,
  members,
  current = false,
}: CommitteeYearProps) {
  return (
    <div className="mb-16">
      <div className="mb-8 flex items-center">
        <h2 className="text-3xl font-bold">{year}</h2>
        {current && (
          <span className="ml-4 inline-block bg-pink-500 px-3 py-1 text-sm font-bold text-white border-2 border-black">
            CURRENT COMMITTEE
          </span>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {members.map((member, index) => (
          <CommitteeMember
            key={index}
            name={member.name}
            position={member.position}
            image={member.image}
            quote={member.quote}
            current={current}
          />
        ))}
      </div>
    </div>
  );
}
