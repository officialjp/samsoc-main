'use client';
import { CommitteeMember } from '@/components/committee/committee-card';
import supabase from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
							const IntYear = parseInt(year);
							if (IntYear === 2006) {
								return (
									<DropdownMenuSub key={index}>
										<DropdownMenuSubTrigger className="border-2 border-black hover:cursor-pointer bg-white hover:bg-gray-100">
											{year}-{IntYear + 3}
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent className="bg-about1">
												{...Array(4)
													.fill(0)
													.map((x, index) => {
														const indexedYear = `${IntYear + index}`;
														return (
															<DropdownMenuItem
																key={
																	year + index
																}
																onClick={() =>
																	onYearChange(
																		indexedYear,
																	)
																}
																className={cn(
																	'border-2 border-black hover:cursor-pointer',
																	activeYear ===
																		indexedYear
																		? 'bg-pink-500 text-white hover:bg-pink-600'
																		: 'bg-white text-black hover:bg-gray-100',
																)}
															>
																{indexedYear}
															</DropdownMenuItem>
														);
													})}
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								);
							} else {
								return (
									<DropdownMenuSub key={index}>
										<DropdownMenuSubTrigger className="border-2 border-black hover:cursor-pointer bg-white hover:bg-gray-100">
											{year}-{IntYear + 4}
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent className="bg-about1">
												{...Array(5)
													.fill(0)
													.map((x, index) => {
														const indexedYear = `${IntYear + index}`;
														return (
															<DropdownMenuItem
																key={
																	year + index
																}
																onClick={() =>
																	onYearChange(
																		indexedYear,
																	)
																}
																className={cn(
																	'border-2 border-black hover:cursor-pointer',
																	activeYear ===
																		indexedYear
																		? 'bg-pink-500 text-white hover:bg-pink-600'
																		: 'bg-white text-black hover:bg-gray-100',
																)}
															>
																{indexedYear}
															</DropdownMenuItem>
														);
													})}
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
								);
							}
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
		type YearCountEntry = [string, number];

		async function fetchHOFData() {
			try {
				const { data } = await supabase
					.from('committee')
					.select('name, role, image, year')
					.order('year', { ascending: false })
					.overrideTypes<Array<TypeCommitteeMemberData>>();

				if (data) {
					const committeeData: TypeCommitteeMemberData[] = data;
					const checkUniqueKeys = () => {
						const keysCount: Record<string, number> = {};

						committeeData.forEach(
							(item: TypeCommitteeMemberData) => {
								keysCount[item.year] =
									(keysCount[item.year] || 0) + 1;
							},
						);
						return keysCount;
					};

					const yearMap = checkUniqueKeys();
					const yearMapSortArr: YearCountEntry[] = Object.entries(
						yearMap,
					)
						.sort()
						.reverse();

					const pastCommittees: TypeCommitteeMemberData[][] = [];
					let pastCounter = 0;

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
			} catch (e: unknown) {
				if (typeof e === 'string') {
					console.error('brokey');
				} else if (e instanceof Error) {
					console.error(e.message);
				}
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
			<div className="SAManim SAMfade-up SAMduration-700 SAMdelay-700 SAMbounce">
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
			</div>

			<div className="SAManim SAMfade-up SAMduration-700 SAMdelay-900 SAMbounce">
				{filteredItems &&
					(filteredItems.length > 0 ? (
						<div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-6  ">
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
											year={year}
											current={current}
											image={image}
										></CommitteeMember>
									);
								},
							)}
						</div>
					) : (
						<div className="border-2 border-black bg-yellow-100 rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<h3 className="text-xl font-bold mb-2">
								No committee members found
							</h3>
							<p>Try changing your filters.</p>
						</div>
					))}
			</div>
		</>
	);
}
