'use client';
import { useEffect, useState } from 'react';
import { CommitteeYear } from '@/components/committee/committee-year';
import supabase from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
	TypeCommitteeMemberData,
	TypeCommitteeYearProps,
} from '@/lib/definitions';
import {
	CollapsibleContent,
	Collapsible,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';

// Define the desired order of positions
const positionOrder = [
	'President',
	'Vice-President',
	'Treasurer',
	'Social Media Secretary',
	'Events Secretary',
];

// Function to determine the sort order of a member based on their position
const getPositionOrder = (position: string): number => {
	const index = positionOrder.indexOf(position);
	return index === -1 ? positionOrder.length : index;
};

const HallOfFameContent: React.FC = () => {
	const [currentCommittee, setCurrentCommittee] =
		useState<TypeCommitteeYearProps | null>(null);
	const [pastCommittees, setPastCommittees] = useState<
		TypeCommitteeYearProps[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCommitteeData = async () => {
			try {
				setLoading(true);
				setError(null);

				const { data: allCommittee, error: fetchError } = await supabase
					.from('committee')
					.select('name, role, image, year')
					.order('year', { ascending: false });

				if (fetchError) {
					setError(
						`Error fetching committee data: ${fetchError.message}`,
					);
					return;
				}

				const members: TypeCommitteeMemberData[] = [];
				allCommittee?.forEach((element) => members.push(element));

				const latestYear = members[0]?.year;

				const formatYearSpan = (year: number | undefined): string => {
					if (year === undefined) {
						return '';
					}
					return `${year}-${year + 1}`;
				};

				const sortMembersByPosition = (
					members: TypeCommitteeMemberData[],
				): TypeCommitteeMemberData[] => {
					return [...members].sort(
						(a, b) =>
							getPositionOrder(a.role) - getPositionOrder(b.role),
					);
				};

				const currentCommitteeData = members.filter(
					(member) => member.year === latestYear,
				);
				const sortedCurrentCommittee =
					sortMembersByPosition(currentCommitteeData);
				setCurrentCommittee({
					year: formatYearSpan(latestYear),
					members: sortedCurrentCommittee,
					current: true,
				});

				const pastCommitteeData: TypeCommitteeMemberData[] =
					members.filter((member) => member.year !== latestYear);

				const pastCommitteesByYear: {
					[year: number]: TypeCommitteeMemberData[];
				} = {};
				pastCommitteeData.forEach((member) => {
					if (pastCommitteesByYear[member.year]) {
						pastCommitteesByYear[member.year].push(member);
					} else {
						pastCommitteesByYear[member.year] = [member];
					}
				});

				const pastCommitteesData: TypeCommitteeYearProps[] =
					Object.entries(pastCommitteesByYear)
						.sort(([, a], [, b]) => b[0].year - a[0].year)
						.map(([year, unsortedMembers]) => ({
							year: formatYearSpan(parseInt(year)),
							members: sortMembersByPosition(unsortedMembers),
						}));

				setPastCommittees(pastCommitteesData);
			} catch (err: any) {
				setError(`An unexpected error occurred: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchCommitteeData();
	}, []);

	if (loading) {
		return (
			<div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
				<h3 className="text-xl font-bold mb-2">
					Loading committee members...
				</h3>
				<p>Please wait while we load the hall of fame.</p>
			</div>
		);
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!currentCommittee) {
		return <div>No current committee data available.</div>;
	}

	return (
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
					<h2 className="inline-block bg-about1 px-4 py-2 text-2xl font-bold border-4 border-black -rotate-1">
						PAST COMMITTEES
					</h2>
					<div className="mt-2 h-1 w-full bg-black"></div>
				</div>

				{pastCommittees.map((committee, index) => (
					<Collapsible key={index}>
						<div className="flex items-center mb-8 flex-row-reverse justify-end space-x-4 text-main-foreground px-4 py-2">
							<h2 className="text-3xl font-bold ml-4">
								{committee.year}
							</h2>
							<CollapsibleTrigger asChild>
								<Button
									variant="default"
									size="sm"
									className="w-9 text-foreground cursor-pointer p-0 bg-about1"
								>
									<ChevronsUpDown className="size-4" />
									<span className="sr-only">Toggle</span>
								</Button>
							</CollapsibleTrigger>
						</div>
						<CollapsibleContent className="transition-all duration-300">
							<CommitteeYear members={committee.members} />
						</CollapsibleContent>
					</Collapsible>
				))}
			</div>
		</div>
	);
};

export default HallOfFameContent;
