'use client';
import { useEffect, useState } from 'react';
import AnimeWordleCard from '@/components/games/anime-wordle-card';
import Form from 'next/form';

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
	const [loadingInputs, setLoadingInputs] = useState(true);
	const [loadingAnswer, setLoadingAnswer] = useState(true);
	const [answerData, setAnswerData] = useState<DataType>();
	const [inputs, setInputs] = useState<DataType[]>([]);

	useEffect(() => {
		fetch('https://api.jikan.moe/v4/anime/52991/full').then((response) =>
			response.json().then((data) => {
				setInputs([...inputs, data.data]);
				setLoadingInputs(false);
			}),
		);
		fetch('https://api.jikan.moe/v4/anime/52992/full').then((response) =>
			response.json().then((data) => {
				setAnswerData(data.data);
				setLoadingAnswer(false);
			}),
		);
	}, []);

	if (loadingInputs || loadingAnswer) {
		console.log('hello');
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
						/>
					</div>
				);
			})}
			<Form action="/games">
				<input name="query" />
				<button type="submit">Deez nuts</button>
			</Form>
		</div>
	);
}
