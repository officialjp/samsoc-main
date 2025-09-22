'use client';
import { CommitteeYear } from '@/components/committee/committee-year';
import { CommitteeMember } from '@/components/committee/committee-card';
import supabase from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, X } from 'lucide-react';
import { Key, useEffect, useState } from 'react';
import ScrollViewCard from '../scroll-view-card';
import { TypeCommitteeMemberData } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/*
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button example={'noShadow'}>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <User />
        <span>Profile</span>
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCard />
        <span>Billing</span>
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings />
        <span>Settings</span>
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Keyboard />
        <span>Keyboard shortcuts</span>
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <Users />
        <span>Team</span>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <UserPlus />
          <span>Invite users</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail />
              <span>Email</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PlusCircle />
              <span>More...</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem>
        <Plus />
        <span>New Team</span>
        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <Github />
      <span>GitHub</span>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <LifeBuoy />
      <span>Support</span>
    </DropdownMenuItem>
    <DropdownMenuItem disabled>
      <Cloud />
      <span>API</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut />
      <span>Log out</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
*/
//HUGE news for the unemployed please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me please help me

interface HOFFilterProps {
	categories: string[];
	years: string[];
	onCategoryChange: (category: string) => void;
	onYearChange: (year: string) => void;
	activeCategory: string;
	activeYear: string;
}

function HallOfFameFilter({
	categories,
	years,
	onCategoryChange,
	onYearChange,
	activeCategory,
	activeYear,
}: HOFFilterProps) {
	return (
		<div className="space-y-6 flex justify-center w-full gap-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild className="w-full">
					<Button className="hover:bg-membership4 bg-membership3">
						{activeCategory}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="md:w-sm lg:w-xl bg-about1">
					<DropdownMenuLabel>Category</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						{categories.map((category) => (
							<DropdownMenuItem
								key={category}
								onClick={() => onCategoryChange(category)}
								className={cn(
									'border-2 border-black hover:cursor-pointer',
									activeCategory === category
										? 'bg-pink-500 text-white hover:bg-pink-600'
										: 'bg-white text-black hover:bg-gray-100',
								)}
							>
								{category}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<p className="justify-center items-center flex text-center">and</p>
			<DropdownMenu>
				<DropdownMenuTrigger asChild className="w-full">
					<Button className="hover:bg-membership4 bg-membership3">
						{activeYear}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="md:w-sm lg:w-xl bg-about1">
					<DropdownMenuLabel>Year</DropdownMenuLabel>
					<DropdownMenuSeparator />

					{years.map((year, index) => {
						if ((index % 5 === 0 || index === 1) && index !== 0) {
							console.log(year);
							return (
								<DropdownMenuSub key={index}>
									<DropdownMenuSubTrigger className="border-2 border-black hover:cursor-pointer bg-white hover:bg-gray-100">
										<span>
											{year}-{parseInt(year) + 4}
										</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent className="bg-about1">
											{...Array(5)
												.fill(0)
												.map((x, index) => 
												(
													<DropdownMenuItem
														key={year + index}
														onClick={() => onYearChange((parseInt(year)+index).toString())}
														className={cn(
															'border-2 border-black hover:cursor-pointer',
															activeYear === (parseInt(year)+index).toString()
																? 'bg-pink-500 text-white hover:bg-pink-600'
																: 'bg-white text-black hover:bg-gray-100',
														)}
													>
														{(parseInt(year)+index).toString()}
													</DropdownMenuItem>
												))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							);
						} else if (index === 0) {
							return (
								<DropdownMenuItem
									key={year}
									onClick={() => onYearChange(year)}
									className={cn(
										'border-2 border-black hover:cursor-pointer',
										activeYear === year
											? 'bg-pink-500 text-white hover:bg-pink-600'
											: 'bg-white text-black hover:bg-gray-100',
									)}
								>
									{year}
								</DropdownMenuItem>
							);
						}
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export default function HallOfFameContent() {
	const [committeeMembers, setCommitteeMembers] =
		useState<TypeCommitteeMemberData[]>();

	useEffect(() => {
		async function fetchHOFData() {
			try {
				let { data } = await supabase
					.from('committee')
					.select('name, role, image, year')
					.order('year', { ascending: false })
					.overrideTypes<Array<TypeCommitteeMemberData>>();

				if (data) {
					const checkUniqueKeys = () => {
						let keysCount: any = {};
						data ??= [];
						data?.forEach((item) => {
							!keysCount[item.year]
								? (keysCount[item.year] = 1)
								: keysCount[item.year]++;
						});
						return keysCount;
					};

					const yearMap = checkUniqueKeys();
					const yearMapSortArr: any = Object.entries(yearMap)
						.sort()
						.reverse();

					const currentCommitee = data?.filter(
						(_, index) => index < yearMapSortArr[0][1],
					);

					const pastCommittees: any = [];
					let pastCounter = 0; //yearMapSortArr[0][1];

					const currentDate = new Date().getFullYear().toString();

					for (let i = 0; i < yearMapSortArr.length; i++) {
						pastCommittees.push(
							data?.filter((item, index) => {
								if (item.year === currentDate) {
									item.current = true;
								}
								return (
									index >= pastCounter &&
									index < pastCounter + yearMapSortArr[i][1]
								);
							}) ?? 0,
						);
						pastCounter += yearMapSortArr[i][1];
					}

					const flatArr = [];
					for (let i = 0; i < pastCommittees.length; i++) {
						flatArr.push(...pastCommittees[i]);
					}

					setCommitteeMembers(flatArr);
				}
			} catch (err: any) {
				console.error(err.message);
			}
		}

		fetchHOFData();
	}, []);

	const categories = [
		'All',
		'Social Media Secretary',
		'President',
		'Vice-President',
		'Events Secretary',
		'Treasurer',
	];

	const years = [
		'All',
		...Array(new Date().getFullYear() - 2005)
			.fill(0)
			.map((_, index) => {
				return (index + 2006).toString();
			}),
	];

	const [activeRole, setActiveRole] = useState<string>('All');
	const [activeYear, setActiveYear] = useState<string>('All');

	const filteredItems = committeeMembers?.filter((item) => {
		const categoryMatch = activeRole === 'All' || item.role === activeRole;
		const yearMatch = activeYear === 'All' || item.year === activeYear;
		return categoryMatch && yearMatch;
	});

	const clearFilters = () => {
		setActiveRole('All');
		setActiveYear('All');
	};

	const hasActiveFilters = activeRole !== 'All' || activeYear !== 'All';

	return (
		<>
			<div className="pb-4">
				{hasActiveFilters && (
					<Button
						variant="default"
						size="sm"
						onClick={clearFilters}
						className="hover:cursor-pointer bg-membership1 hover:bg-pink-300"
					>
						<X className="h-3 w-3 mr-1" /> Clear Filters
					</Button>
				)}
			</div>
			<h1>Filters:</h1>
			<HallOfFameFilter
				categories={categories}
				years={years}
				onCategoryChange={setActiveRole}
				onYearChange={setActiveYear}
				activeCategory={activeRole}
				activeYear={activeYear}
			/>

			<div>
				{filteredItems ? (
					filteredItems.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{filteredItems.map(
								(
									{ name, role, image, year, current },
									index,
								) => {
									return (
										<CommitteeMember
											key={index + name}
											name={name}
											position={role}
											current={current}
											image={image}
										></CommitteeMember>
									);
								},
							)}
						</div>
					) : (
						<div className="border-2 border-black bg-yellow-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<h3 className="text-xl font-bold mb-2">
								No committee members found
							</h3>
							<p>Try changing your filters.</p>
						</div>
					)
				) : (
					<div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						<h3 className="text-xl font-bold mb-2">
							Loading committee...
						</h3>
						<p>Please wait while we load the hall of fame.</p>
					</div>
				)}
			</div>
		</>
	);
}

function e() {
	/*

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

				{pastCommittees?.map(
					(
						committee: TypeCommitteeMemberData[],
						index: Key | null | undefined,
					) => (
						<Collapsible key={index}>
							<div className="flex items-center mb-8 flex-row-reverse justify-end space-x-4 text-main-foreground px-4 py-2">
								<h2 className="text-3xl font-bold ml-4">
									{committee[0].year}
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
								<CommitteeYear members={committee} />
							</CollapsibleContent>
						</Collapsible>
					),
				)}
			</div>
		</div>
	); */
}
