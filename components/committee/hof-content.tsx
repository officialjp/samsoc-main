'use client';
import { CommitteeYear } from '@/components/committee/committee-year';
import { CommitteeMember } from '@/components/committee/committee-card';
import supabase from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, X } from 'lucide-react';
import { Key, useEffect, useState } from 'react';
import ScrollViewCard from './scroll-view-card';
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
		<div className="space-y-6 flex justify-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>{activeCategory}</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
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

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>{activeYear}</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56">
					<DropdownMenuLabel>Year</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<span>Invite users</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<span>Email</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<span>Message</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<span>More...</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						{years.map((year) => (
							<DropdownMenuItem
								key={year}
								onClick={() => onYearChange(year)}
								className={cn(
									'border-2 border-black hover:cursor-pointer',
									activeYear === year
										? 'bg-cyan-500 text-white hover:bg-cyan-600'
										: 'bg-white text-black hover:bg-gray-100',
								)}
							>
								{year}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);

	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h3 className="text-lg font-bold">Categories</h3>
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => (
						<Button
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
						</Button>
					))}
				</div>
			</div>

			<div className="space-y-3">
				<h3 className="text-lg font-bold">Years</h3>
				<div className="flex flex-wrap gap-2">
					{years.map((year) => (
						<Button
							key={year}
							onClick={() => onYearChange(year)}
							className={cn(
								'border-2 border-black hover:cursor-pointer',
								activeYear === year
									? 'bg-cyan-500 text-white hover:bg-cyan-600'
									: 'bg-white text-black hover:bg-gray-100',
							)}
						>
							{year}
						</Button>
					))}
				</div>
			</div>
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
			<div className="lg:sticky lg:top-24 h-fit">
				<div className="border-2 rounded-md border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
					<h2 className="text-2xl font-bold mb-6">Filter HOF</h2>
					<div className="flex justify-between items-center mb-6">
						{hasActiveFilters && (
							<Button
								variant="default"
								size="sm"
								onClick={clearFilters}
								className="hover:cursor-pointer"
							>
								<X className="h-3 w-3 mr-1" /> Clear Filters
							</Button>
						)}
					</div>

					<HallOfFameFilter
						categories={categories}
						years={years}
						onCategoryChange={setActiveRole}
						onYearChange={setActiveYear}
						activeCategory={activeRole}
						activeYear={activeYear}
					/>

					<div className="mt-8 pt-6 border-t-2 border-gray-200">
						<p className="text-sm text-gray-600 mb-2">
							Currently showing:
						</p>
						<div className="flex flex-wrap gap-2">
							<span className="bg-pink-100 px-2 py-1 text-sm border border-pink-300 rounded-md">
								{activeRole}
							</span>
							<span className="bg-cyan-100 px-2 py-1 text-sm border border-cyan-300 rounded-md">
								{activeYear}
							</span>
						</div>
						<p className="mt-4 text-sm text-gray-600">
							{filteredItems?.length ?? 0} photo
							{(filteredItems?.length ?? 0) !== 1 ? 's' : ''}{' '}
							found
						</p>
					</div>
				</div>
			</div>

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
