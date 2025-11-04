interface AnimeCardProps {
	inputData: DataType;
	answerData: DataType;
}

interface DataType {
	title: string;
	year: number;
	genres: string[];
	themes: string[];
	studios: string[];
	source: string;
	score: number;
}

export default function AnimeWordleCard({
	inputData,
	answerData,
}: AnimeCardProps) {
	function checkForMatch(item: string, item2: string[]) {
		item2.forEach((item) => {
			if (item === item) {
				return true;
			}
		});

		return false;
	}

	return (
		<div className="flex flex-cols-2">
			<div className="flex flex-row gap-4">
				{inputData.title === answerData.title ? (
					<h1 className="text-green-500">{inputData.title}</h1>
				) : (
					<h1 className="text-red-500">{inputData.title}</h1>
				)}

				{inputData.year === answerData.year ? (
					<h1 className="text-green-500">{inputData.year}</h1>
				) : (
					<h1 className="text-red-500">{inputData.year}</h1>
				)}
				<div>
					{inputData.themes.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
									<h1 className="text-green-500">{item}</h1>
								) : (
									<h1 className="text-red-500">{item}</h1>
								)}
							</div>
						);
					})}
				</div>
				<div>
					{inputData.studios.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
									<h1 className="text-green-500">{item}</h1>
								) : (
									<h1 className="text-red-500">{item}</h1>
								)}
							</div>
						);
					})}
				</div>
				<div>
					{inputData.genres.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
									<h1 className="text-green-500">{item}</h1>
								) : (
									<h1 className="text-red-500">{item}</h1>
								)}
							</div>
						);
					})}
				</div>
				{inputData.source === answerData.source ? (
					<h1 className="text-green-500">{inputData.source}</h1>
				) : (
					<h1 className="text-red-500">{inputData.source}</h1>
				)}
				{inputData.score === answerData.score ? (
					<h1 className="text-green-500">{inputData.score}</h1>
				) : (
					<h1 className="text-red-500">{inputData.score}</h1>
				)}
			</div>
		</div>
	);
}
