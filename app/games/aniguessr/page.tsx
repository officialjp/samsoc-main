'use client';
import { useEffect, useState } from 'react';
import AnimeWordleCard from '@/components/games/anime-wordle-card';
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
			<table className="border-collapse border border-gray-400 border-spacing-0 min-w-[650px] w-[100%] table">
				<caption className="caption-top">Make sure to guess!</caption>
				<thead>
					<tr>
						<th>Title</th>
						<th>Year</th>
						<th>Genres</th>
						<th>Studios</th>
						<th>Themes</th>
						<th>Source</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{inputs.map((item, index) => {
						return (
							<tr key={index}>
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
									{item.year === answerData.year ? (
										<h1 className="text-green-500 flex justify-center items-center">
											{item.year}
										</h1>
									) : (
										<h1 className="text-red-500 flex justify-center items-center">
											{item.year}
											{item.year < answerData.year ? (
												<ArrowUp></ArrowUp>
											) : (
												<ArrowDown></ArrowDown>
											)}
										</h1>
									)}
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
											{item.score < answerData.score ? (
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
			<div className="w-[50%] bg-black">
				<SearchAnimeData inputState={setInputVal} />
			</div>
		</div>
	);
}
