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

export default async function HallOfFameContent () {

    const { data: data, error: fetchError } = await supabase
        .from('committee')
        .select('name, role, image, year')
        .order('year', { ascending: false })
        .overrideTypes<Array<TypeCommitteeMemberData>>();

    if (fetchError) {
        console.error(fetchError);
    }

    const currentCommitee = data?.filter((item, index) => index<5);
    const pastCommittees = data?.filter((item, index) => index>5);
	return (
		<div className="relative">
			<div className="relative z-10">
				<CommitteeYear
					year={data?.[0].year.toString()}
					members={currentCommitee}
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

				{pastCommittees?.map((committee, index) => (
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