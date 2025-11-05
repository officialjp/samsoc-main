import { ArrowDown, ArrowUp } from 'lucide-react';

export default function AnimeWordleCard({ inputData, answerData }) {
	const checkForMatch = (item, item2) => {
		item2.forEach((itemInstance) => {
			if (itemInstance.name === item.name) {
				return true;
			}
		});
		return false;
	};

	return (
		<div className="flex">
			<div className="grid grid-cols-7 w-6xl gap-4 items-center justify-center text-sm border h-20">
				{inputData.title === answerData.title ? (
					<h1 className="text-green-500 flex justify-center items-center">
						{inputData.title}
					</h1>
				) : (
					<h1 className="text-red-500 flex justify-center items-center">
						{inputData.title}
					</h1>
				)}

				{inputData.year === answerData.year ? (
					<h1 className="text-green-500 flex justify-center items-center">
						{inputData.year}
					</h1>
				) : (
					<h1 className="text-red-500 flex justify-center items-center">
						{inputData.year}
						{inputData.year < answerData.year ? (
							<ArrowUp></ArrowUp>
						) : (
							<ArrowDown></ArrowDown>
						)}
					</h1>
				)}
				<div>
					{inputData.themes.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
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
				</div>
				<div>
					{inputData.studios.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
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
				</div>
				<div>
					{inputData.genres.map((item, index) => {
						return (
							<div key={index}>
								{checkForMatch(item, answerData.themes) ? (
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
				</div>
				{inputData.source === answerData.source ? (
					<h1 className="text-green-500 flex justify-center items-center">
						{inputData.source}
					</h1>
				) : (
					<h1 className="text-red-500 flex justify-center items-center">
						{inputData.source}
					</h1>
				)}
				{inputData.score === answerData.score ? (
					<h1 className="text-green-500 flex justify-center items-center">
						{inputData.score}
					</h1>
				) : (
					<h1 className="text-red-500 flex justify-center items-center">
						{inputData.score}
						{inputData.score < answerData.score ? (
							<ArrowUp></ArrowUp>
						) : (
							<ArrowDown></ArrowDown>
						)}
					</h1>
				)}
			</div>
		</div>
	);
}
