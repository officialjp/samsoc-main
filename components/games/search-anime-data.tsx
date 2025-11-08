'use client';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import index from '@/public/indexes.json';

export default function SearchAnimeData({ inputState, className }) {
	const [auto, setAuto] = useState(<div hidden></div>);
	const [cooldown, setCooldown] = useState(false);
	const [input, setInput] = useState('');
	const inputBar = useRef(null);

	const cooldownFn = () => {
		return new Promise((res) => {
			setTimeout(() => {
				res('');
			}, 1000);
		});
	};

	const searchAnimeIndex = (event) => {
		setInput(event.currentTarget.value);
	};

	const confirmAnimeIndex = (event) => {
		console.log(event);
	};

	const blur = () => {};

	const focus = () => {};

	const autoCompleteClickHandler = async (event, key) => {
		if (cooldown || input === key) return;
		inputState(key);
		setCooldown(true);

		await cooldownFn();
		setCooldown(false);
	};

	function AutoComplete({ className }) {
		const buttonArr = Object.entries(index)
			.filter(([_, value]) =>
				value.toLowerCase().includes(input.toLowerCase()),
			)
			.sort()
			.map(([key, value], index) => {
				const lowerVal = value.toLowerCase();
				const lowerInp = input.toLowerCase();
				const inputIndex = lowerVal.indexOf(lowerInp);

				return (
					<Button
						className="bg-white w-full"
						key={index + 'autoComp'}
						onClick={(event) =>
							autoCompleteClickHandler(event, key)
						}
					>
						<p>
							{value.slice(0, inputIndex)}
							{
								<span className="font-bold text-red-600">
									{value.slice(
										inputIndex,
										inputIndex + lowerInp.length,
									)}
								</span>
							}
							{value.slice(
								inputIndex + lowerInp.length,
								lowerVal.length,
							)}
						</p>
					</Button>
				);
			});

		return (
			input.length > 1 && (
				<section
					className={cn('w-[50%] absolute flex flex-col', className)}
				>
					{buttonArr
						.slice(0, Math.min(buttonArr.length, 3))
						.map((button, index) => {
							return <div key={index}>{button}</div>;
						})}
				</section>
			)
		);
	}

	return (
		<div>
			<Input
				id="AnimeSearchInput"
				className={cn('rounded-2xl', className)}
				ref={inputBar}
				type="text"
				placeholder="Anime name"
				onChange={searchAnimeIndex}
				onFocus={focus}
				spellCheck="false"
				autoComplete="off"
				onBlur={blur}
			/>
			<AutoComplete className="z-10"></AutoComplete>
		</div>
	);
}
