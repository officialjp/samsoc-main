'use client';
import { useEffect, useState } from 'react';
import SearchAnimeData from '@/components/games/search-anime-data';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { SectionContainer } from '@/components/section-container';
import { SectionHeading } from '@/components/section-heading';
import supabase from '@/utils/supabase/client';
interface DataType {
	title: string;
	year: number;
	genres: StringType;
	themes: StringType;
	studios: StringType;
	source: string;
	score: number;
}

interface StringType {
	name: string;
}

export default function Page() {
	const [loadingAnswer, setLoadingAnswer] = useState(true);
	const [answerData, setAnswerData] = useState<DataType>();
	const [inputs, setInputs] = useState<DataType[]>([]);
	const [attempts, setAttempts] = useState(0);
	const [completed, setCompleted] = useState(false);
	const [inputVal, setInputVal] = useState(0);
	const [answerVal, setAnswerVal] = useState(0);

	const checkForMatch = (item, item2) => {
		for (let i = 0; i < item2.length; i++) {
			if (item2[i].name === item.name) {
				return true;
			}
		}
		return false;
	};

	useEffect(() => {
		async function fetchInputData() {
			try {
				const { data } = await supabase
					.from('animedata')
					.select('*')
					.eq('id', inputVal);
				setInputs([...inputs, data]);
				console.log(data);
			} catch (e: unknown) {
				if (typeof e === 'string') {
					console.error('brokey');
				} else if (e instanceof Error) {
					console.error(e.message);
				}
			}
		}
		setAnswerVal(1);
		if (answerVal === 0) return;
		fetch(`https://api.jikan.moe/v4/anime/${answerVal}/full`).then(
			(response) =>
				response.json().then((data) => {
					setAnswerData(data.data);
					setLoadingAnswer(false);
				}),
		);

		if (inputVal === 0) return;
		fetchInputData();
		if (inputVal == answerVal) {
			setCompleted(true);
			return;
		}
	}, [inputVal, answerVal]);

	if (attempts > 19) {
		return (
			<div>
				<h1>You lose</h1>
			</div>
		);
	}

	if (loadingAnswer) {
		return (
			<div>
				<p>its loading</p>
			</div>
		);
	}

	return (
		<div>
			<SectionContainer>
				<SectionHeading
					badge="Wordle"
					title="Anime Wordle"
					description="Play our anime wordle and be the best so that you can win some prizes!"
				></SectionHeading>
				<div className="flex items-center justify-center flex-col">
					{(!completed || attempts > 19) && (
						<div className="w-[50%] mb-8 mt-8">
							<SearchAnimeData inputState={setInputVal} />
						</div>
					)}

					{(completed || attempts > 19) && (
						<div className="mb-8 mt-8 flex flex-row gap-4 items-center justify-center">
							<Image
								className="rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2"
								alt={answerData.title}
								src={answerData.images.jpg.large_image_url}
								width={200}
								height={300}
							></Image>
							<div className="bg-gray-700 p-1 rounded-2xl">
								<p className="text-white rounded-2xl text-xs">
									{answerData?.year}
								</p>
							</div>
							<div>
								<h1 className="font-bold">
									{answerData?.title}
								</h1>
							</div>
						</div>
					)}

					<div className="relative w-[min(1200px,80%)] block mb-8 mx-auto border-2 border-black rounded-2xl px-6 pb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-default">
						<table className="relative border-collapse border-spacing-0 w-full">
							<thead className="relative h-12">
								<tr className="">
									{[
										'Title',
										'Year',
										'Genres',
										'Themes',
										'Studios',
										'Source',
										'Score',
									].map((item, index) => {
										return (
											<th className="" key={index + 'th'}>
												<span className="">{item}</span>
											</th>
										);
									})}
								</tr>
							</thead>
							<tbody className="relative">
								{inputs.map((item, index) => {
									return (
										<tr
											key={index}
											className="py-6 min-h-30 h-fit rounded-2xl"
										>
											<td>
												{item.title ===
												answerData.title ? (
													<h1 className="text-green-500 flex justify-center items-center">
														{item.title}
													</h1>
												) : (
													<h1 className="text-red-500 flex justify-center items-center">
														{item.title}
													</h1>
												)}
											</td>
											<td>
												<div className="relative flex items-center justify-center h-full">
													{item.year ===
													answerData.year ? (
														<h1 className="text-green-500 flex justify-center items-center">
															{item.year}
														</h1>
													) : (
														<h1 className="text-red-500 flex justify-center items-center">
															{item.year}
															{item.year <
															answerData.year ? (
																<ArrowUp className="absolute w-17 h-17 opacity-30"></ArrowUp>
															) : (
																<ArrowDown className="absolute w-17 h-17 opacity-30"></ArrowDown>
															)}
														</h1>
													)}
												</div>
											</td>
											<td>
												{item.genres.map(
													(item, index) => {
														return (
															<div key={index}>
																{checkForMatch(
																	item,
																	answerData.genres,
																) ? (
																	<h1 className="text-green-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																) : (
																	<h1 className="text-red-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																)}
															</div>
														);
													},
												)}
											</td>
											<td>
												{item.themes.map(
													(item, index) => {
														return (
															<div key={index}>
																{checkForMatch(
																	item,
																	answerData.themes,
																) ? (
																	<h1 className="text-green-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																) : (
																	<h1 className="text-red-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																)}
															</div>
														);
													},
												)}
											</td>
											<td>
												{item.studios.map(
													(item, index) => {
														return (
															<div key={index}>
																{checkForMatch(
																	item,
																	answerData.studios,
																) ? (
																	<h1 className="text-green-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																) : (
																	<h1 className="text-red-500 flex justify-center items-center">
																		{
																			item.name
																		}
																	</h1>
																)}
															</div>
														);
													},
												)}
											</td>
											<td>
												{item.source ===
												answerData.source ? (
													<h1 className="text-green-500 flex justify-center items-center">
														{item.source}
													</h1>
												) : (
													<h1 className="text-red-500 flex justify-center items-center">
														{item.source}
													</h1>
												)}
											</td>
											<td>
												{item.score ===
												answerData.score ? (
													<h1 className="text-green-500 flex justify-center items-center">
														{item.score}
													</h1>
												) : (
													<h1 className="text-red-500 flex justify-center items-center">
														{item.score}
														{item.score <
														answerData.score ? (
															<ArrowUp className="absolute w-17 h-17 opacity-30"></ArrowUp>
														) : (
															<ArrowDown className="absolute w-17 h-17 opacity-30"></ArrowDown>
														)}
													</h1>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</SectionContainer>
		</div>
	);
}
