'use client';
import { useEffect, useRef, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const index = {
	'1': 'Cowboy Bebop',
	'6': 'Trigun',
	'7': 'Witch Hunter Robin',
	'8': 'Bouken Ou Beet',
	'15': 'Eyeshield 21',
	'16': 'Hachimitsu to Clover',
	'17': 'Hungry Heart: Wild Striker',
	'18': 'Initial D Fourth Stage',
	'19': 'Monster',
	'20': 'Naruto',
	'21': 'One Piece',
	'22': 'Tennis no Oujisama',
	'23': 'Ring ni Kakero 1',
	'24': 'School Rumble',
	'25': 'Sunabouzu',
	'26': 'Texhnolyze',
	'27': 'Trinity Blood',
	'28': 'Yakitate!! Japan',
	'29': 'Zipang',
	'30': 'Shinseiki Evangelion',
	'33': 'Kenpuu Denki Berserk',
	'43': 'Koukaku Kidoutai',
	'44': 'Rurouni Kenshin: Meiji Kenkaku Romantan - Tsuioku-hen',
	'46': 'Rurouni Kenshin: Meiji Kenkaku Romantan - Ishinshishi e no Chinkonka',
	'47': 'Akira',
	'48': '.hack//Sign',
	'49': 'Aa! Megami-sama!',
	'51': 'Tenshi Kinryouku',
	'52': 'Kidou Tenshi Angelic Layer',
	'53': 'Ai Yori Aoshi',
	'54': 'Appleseed (Movie)',
	'55': 'Arc the Lad',
	'56': 'Avenger',
	'57': 'Beck',
	'58': 'Blue Gender',
	'59': 'Chobits',
	'60': 'Chrno Crusade',
	'61': 'D.N.Angel',
	'62': 'D.C.: Da Capo',
	'63': 'DearS',
	'64': 'Rozen Maiden',
	'66': 'Azumanga Daiou The Animation',
	'67': 'Basilisk: Kouga Ninpou Chou',
	'68': 'Black Cat',
	'69': 'Cluster Edge',
	'71': 'Full Metal Panic!',
	'74': 'Gakuen Alice',
	'75': 'Soukyuu no Fafner: Dead Aggressor',
	'76': 'Mahou Shoujo Lyrical Nanoha',
	'79': 'Shuffle!',
	'80': 'Kidou Senshi Gundam',
	'83': "Kidou Senshi Gundam: Dai 08 MS Shoutai - Miller's Report",
	'84': 'Kidou Senshi Gundam 0083: Stardust Memory',
	'86': 'Kidou Senshi Gundam ZZ',
	'88': 'Kidou Senshi Gundam F91',
	'91': 'Shin Kidou Senki Gundam Wing: Endless Waltz',
	'94': 'Kidou Senshi Gundam SEED Destiny',
	'97': 'Last Exile',
	'98': 'Mai-HiME',
};

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
						className="bg-red"
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
				<section className={cn('absolute flex flex-col', className)}>
					{buttonArr
						.slice(0, Math.min(buttonArr.length, 3))
						.map((button) => {
							return <div>{button}</div>;
						})}
				</section>
			)
		);
	}

	return (
		<>
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
		</>
	);
}
