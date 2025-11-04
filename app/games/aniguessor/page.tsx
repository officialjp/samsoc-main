'use client';
import { useEffect, useState } from 'react';
import AnimeWordleCard from '@/components/games/anime-wordle-card';
import SearchAnimeData from '@/components/games/search-anime-data';

interface DataType {
	title: string;
	year: number;
	genres: string[];
	themes: string[];
	studios: string[];
	source: string;
	score: number;
}

export default function Page() {
	const [loadingAnswer, setLoadingAnswer] = useState(true);
	const [answerData, setAnswerData] = useState<DataType>();
	const [inputs, setInputs] = useState<DataType[]>([]);
	const [attempts, setAttempts] = useState(0);
	const [inputVal, setInputVal] = useState(0);

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
		<div>
			{inputs.map((item, index) => {
				return (
					<div key={index}>
						<AnimeWordleCard
							inputData={item}
							answerData={answerData}
						></AnimeWordleCard>
						,
					</div>
				);
			})}
			<SearchAnimeData inputState={setInputVal} />
		</div>
	);
}
