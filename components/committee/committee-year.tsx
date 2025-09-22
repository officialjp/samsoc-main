import { CommitteeMember } from './committee-card';
import { TypeCommitteeYearProps } from '@/lib/definitions';

export function CommitteeYear({
	members,
	current = false,
}: TypeCommitteeYearProps) {
	return (
		<div className="mb-8">
			{current && (
				<div className="mb-8 flex items-center">
					<span className="ml-4 inline-block bg-about1 px-3 py-1 text-sm font-bold text-text1 border-2 border-black">
						CURRENT COMMITTEE
					</span>
				</div>
			)}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{members?.map((member, index) => (
					<CommitteeMember
						key={index}
						name={member.name}
						position={member.role}
						image={member.image}
						current={current}
					/>
				))}
			</div>
		</div>
	);
}
