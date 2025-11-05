'use client';
import { useEffect, useState } from 'react';
import SearchAnimeData from '@/components/games/search-anime-data';
import { ArrowDown, ArrowUp } from 'lucide-react';

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
	const [inputVal, setInputVal] = useState(0);

	const checkForMatch = (item, item2) => {
		item2.forEach((itemInstance) => {
			if (itemInstance.name === item.name) {
				return true;
			}
		});
		return false;
	};

	useEffect(() => {
		fetch('https://api.jikan.moe/v4/anime/52991/full').then((response) =>
			response.json().then((data) => {
				setAnswerData(data.data);
				setLoadingAnswer(false);
			}),
		);

		if (inputVal === 0) return;
		fetch(`https://api.jikan.moe/v4/anime/${inputVal}/full`).then(
			(response) =>
				response.json().then((data) => {
					setInputs([...inputs, data.data]);
				}),
		);
	}, [inputVal]);

	if (loadingAnswer) {
		return (
			<div>
				<p>its loading</p>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center flex-col">
			<h1>ANIGUESSR</h1>

			<div className="w-[50%]">
				<SearchAnimeData inputState={setInputVal} />
			</div>

			<div className="relative w-[min(1200px,80%)] block mx-auto border-2 border-black rounded-2xl px-6 pb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:cursor-default">
				<table className="realtive border-collapse border-spacing-0 w-full">
					<thead className="relative h-12">
						<tr className="">
							{[
								'Title',
								'Year',
								'Genres',
								'Studios',
								'Themes',
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
									className="py-6 min-h-30 h-fit border-2 border-black rounded-2xl"
								>
									<td>
										{item.title === answerData.title ? (
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
											{item.year === answerData.year ? (
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
														<ArrowDown></ArrowDown>
													)}
												</h1>
											)}
										</div>
									</td>
									<td>
										{item.genres.map((item, index) => {
											return (
												<div key={index}>
													{checkForMatch(
														item,
														answerData.themes,
													) ? (
														<h1 className="text-green-500 flex justify-center items-center">
															{item.name}
														</h1>
													) : (
														<h1 className="text-red-500 flex justify-center items-center">
															{item.name}
														</h1>
													)}
												</div>
											);
										})}
									</td>
									<td>
										{item.themes.map((item, index) => {
											return (
												<div key={index}>
													{checkForMatch(
														item,
														answerData.themes,
													) ? (
														<h1 className="text-green-500 flex justify-center items-center">
															{item.name}
														</h1>
													) : (
														<h1 className="text-red-500 flex justify-center items-center">
															{item.name}
														</h1>
													)}
												</div>
											);
										})}
									</td>
									<td>
										{item.studios.map((item, index) => {
											return (
												<div key={index}>
													{checkForMatch(
														item,
														answerData.themes,
													) ? (
														<h1 className="text-green-500 flex justify-center items-center">
															{item.name}
														</h1>
													) : (
														<h1 className="text-red-500 flex justify-center items-center">
															{item.name}
														</h1>
													)}
												</div>
											);
										})}
									</td>
									<td>
										{item.source === item.source ? (
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
										{item.score === answerData.score ? (
											<h1 className="text-green-500 flex justify-center items-center">
												{item.score}
											</h1>
										) : (
											<h1 className="text-red-500 flex justify-center items-center">
												{item.score}
												{item.score <
												answerData.score ? (
													<ArrowUp></ArrowUp>
												) : (
													<ArrowDown></ArrowDown>
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
	);
}
