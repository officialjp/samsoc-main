'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WORDLE_HINT_CONFIG } from '~/lib/game-config';
import { getCharacterNames } from './game-utils';

interface WordleHintsProps {
	guessCount: number;
	isGameOver: boolean;
	title: string | null | undefined;
	description: string | null | undefined;
	characters: unknown;
	image: string | null | undefined;
}

export default function WordleHints({
	guessCount,
	isGameOver,
	title,
	description,
	characters,
	image,
}: WordleHintsProps) {
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	const {
		DESCRIPTION_THRESHOLD,
		CHARACTERS_THRESHOLD,
		BLURRED_IMAGE_THRESHOLD,
		CHARACTER_COUNT,
		BLUR_AMOUNT,
		DESCRIPTION_PREVIEW_LENGTH,
	} = WORDLE_HINT_CONFIG;

	// Determine which hints are unlocked
	const showDescription = guessCount >= DESCRIPTION_THRESHOLD || isGameOver;
	const showCharacters = guessCount >= CHARACTERS_THRESHOLD || isGameOver;
	const showImage = guessCount >= BLURRED_IMAGE_THRESHOLD || isGameOver;
	const showUnblurredImage = isGameOver;

	// Parse character names
	const characterNames = getCharacterNames(characters, CHARACTER_COUNT);

	// If no hints are unlocked yet, don't render anything
	if (!showDescription && !showCharacters && !showImage) {
		return null;
	}

	// Description truncation logic
	const descriptionText = description ?? 'No description available';
	const needsTruncation = descriptionText.length > DESCRIPTION_PREVIEW_LENGTH;
	const displayDescription =
		needsTruncation && !isDescriptionExpanded
			? `${descriptionText.slice(0, DESCRIPTION_PREVIEW_LENGTH)}...`
			: descriptionText;

	return (
		<div className="max-w-2xl mx-auto px-4 md:px-8 mb-6">
			<div className="border-2 border-black rounded-xl bg-white p-4 md:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
				{/* Title - shown only on game over */}
				{isGameOver && title && (
					<h3 className="font-bold text-gray-900 text-lg md:text-xl mb-4 pb-3 border-b-2 border-black animate-in fade-in slide-in-from-top-2 duration-300">
						{title}
					</h3>
				)}

				<div className="flex gap-4 md:gap-5">
					{/* Left side: Cover Image */}
					{showImage && image && (
						<div
							className="relative flex-shrink-0 w-[140px] md:w-[175px] h-[210px] md:h-[262px] rounded-lg overflow-hidden border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-left-2 duration-300"
							role="region"
							aria-label="Cover image hint"
						>
							<Image
								src={image}
								alt="Anime cover"
								fill
								className="object-cover transition-all duration-500"
								style={{
									filter: showUnblurredImage
										? 'none'
										: `blur(${BLUR_AMOUNT}px)`,
								}}
								draggable={false}
								sizes="175px"
							/>
						</div>
					)}

					{/* Right side: Description and Characters */}
					<div className="flex-1 min-w-0 flex flex-col gap-3">
						{/* Description Hint */}
						{showDescription && (
							<div
								className="border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-blue-50 animate-in fade-in slide-in-from-top-2 duration-300"
								role="region"
								aria-label="Description hint"
							>
								<p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
									Description
								</p>
								<p className="text-sm text-gray-700 leading-relaxed">
									{displayDescription}
									{needsTruncation && (
										<button
											onClick={() =>
												setIsDescriptionExpanded(
													!isDescriptionExpanded,
												)
											}
											className="ml-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide transition-colors"
										>
											{isDescriptionExpanded
												? '[Less]'
												: '[More]'}
										</button>
									)}
								</p>
							</div>
						)}

						{/* Characters Hint */}
						{showCharacters && (
							<div
								className="border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-purple-50 animate-in fade-in slide-in-from-top-2 duration-300"
								role="region"
								aria-label="Characters hint"
							>
								<p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
									Characters
								</p>
								{characterNames.length > 0 ? (
									<div className="flex flex-wrap gap-1.5">
										{characterNames.map((name, idx) => (
											<span
												key={idx}
												className="inline-block px-2.5 py-1 bg-white border-2 border-black rounded-full text-sm font-medium shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
											>
												{name}
											</span>
										))}
									</div>
								) : (
									<p className="text-sm text-gray-500 italic">
										No character data available
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
