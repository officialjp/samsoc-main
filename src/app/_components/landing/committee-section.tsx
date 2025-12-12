import { Suspense } from 'react';
import { api } from '~/trpc/server';
import { CommitteeCard } from './committee-card';
import { SectionHeading } from '../section-heading';

async function CommitteeFetcher() {
	const committeResult = await api.post.getCommitteeMembers();
	const committee = committeResult.data ?? [];

	return (
		<div className="flex flex-col lg:flex-row gap-8 items-center justify-center py-6 auto-rows-fr">
			{committee.map((member) => (
				<CommitteeCard
					key={member.id}
					id={member.id}
					name={member.name}
					role={member.role}
					source={member.source}
				/>
			))}
		</div>
	);
}

export function CommitteeSection() {
	return (
		<>
			<SectionHeading
				badge="COMMITTEE"
				title="Meet Our Committee"
				badgeColor="bg-purple-200"
				description="The masterminds behind our beautifully constructed events, sessions and much more!"
			/>
			<Suspense
				fallback={
					<div className="h-[300px] w-full animate-pulse bg-gray-100 rounded-xl" />
				}
			>
				<CommitteeFetcher />
			</Suspense>
		</>
	);
}
