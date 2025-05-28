'use client';
import Link from 'next/link';
import Instagram from '@/public/instagram.svg';
import Facebook from '@/public/facebook.svg';
import { ChevronRight, Trophy, Ribbon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SvgIcon } from '@/components/svgIcon';
import { cn } from '@/lib/utils';
import useIsMobile from '../mobile-check';
import Discord from '@/public/discord.svg';

// Data for the awards
const awardsData = [
	{
		title: 'Society of the Year 2024/25',
		description: 'Student Union Awards',
		icon: Trophy,
	},
	{
		title: 'Society of the Year 2022/23',
		description: 'Student Union Awards',
		icon: Trophy,
	},
	{
		title: 'Society of the Year 2021/22',
		description: 'Student Union Awards',
		icon: Trophy,
	},
	{
		title: 'Alan Sutherland Award 2022/23',
		description: 'Student Union Awards',
		icon: Ribbon,
	},
	{
		title: 'Gold RAG Award 2021/22',
		description: 'Student Union Awards',
		icon: Star,
	},
];

export function HeroSection() {
	if (useIsMobile()) {
		return (
			<section className="w-full py-8 pt-10 sm:py-12 md:py-20 lg:py-32">
				<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
					<div className="grid gap-6 md:gap-8 lg:gap-12 lg:grid-cols-2 xl:grid-cols-[1fr_auto]">
						{' '}
						{/* Adjusted grid-cols */}
						<div className="flex flex-col justify-center space-y-6 md:space-y-8">
							<div className="space-y-2">
								<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter">
									<span className="bg-about3 px-2 py-1 rotate-1 inline-block border-2 border-black">
										WELCOME
									</span>{' '}
									<span className="bg-about2 px-2 py-1 -rotate-2 inline-block border-2 border-black">
										TO
									</span>{' '}
									<span className="bg-about1 px-2 py-1 -rotate-2 inline-block border-2 border-black">
										SAMsoc!
									</span>
								</h1>
								<p className="max-w-full text-base sm:text-lg md:text-xl text-text1">
									Watch anime screenings together and join us
									at one of our many events!
								</p>
							</div>
						</div>
						{/* Move the awards section into the right column */}
						<div className="lg:block justify-center mt-8 lg:mt-0 flex flex-row items-center">
							<div className="mb-6 flex flex-col items-center justify-center">
								<h2
									className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter
                           bg-about1 border-2 border-black inline-block px-3 py-2 -rotate-1 mb-3"
								>
									Our Achievements
								</h2>
								<div
									className={cn(
										'rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
										'bg-card backdrop-blur-md',
										'inline-block self-start',
									)}
								>
									<ul className="space-y-2 p-4 sm:p-6">
										{' '}
										{/* Reduced vertical spacing and padding */}
										{awardsData.map((award, index) => (
											<li
												key={index}
												className="flex items-center gap-2 sm:gap-3"
											>
												<div
													className={cn(
														'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
														'bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-black',
														'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
													)}
												>
													<award.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white/90" />
												</div>
												<div className="flex-grow">
													<h3 className="text-sm sm:text-lg font-semibold text-text1 truncate">
														{award.title}
													</h3>
													<p className="text-xs sm:text-sm text-text1/80 truncate">
														{award.description}
													</p>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6">
						<Button
							asChild
							className="bg-thebutton text-white text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-7 px-4 sm:px-6 md:px-8 border-2 rounded-md border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
						>
							<Link
								href="#join"
								className="flex items-center justify-center"
							>
								<span className="mr-2">🎉</span> Join Now{' '}
								<ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		);
	} else {
		return (
			<section className="w-full py-8 pt-10 sm:py-12 md:py-20 lg:py-32">
				<div className="container w-full max-w-full px-4 md:px-6 lg:px-8">
					<div className="grid gap-6 md:gap-8 lg:gap-12 lg:grid-cols-2 xl:grid-cols-[1fr_auto]">
						{' '}
						<div className="flex flex-col justify-center space-y-6 md:space-y-12">
							<div className="space-y-2">
								<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter">
									<span className="bg-about3 px-2 py-1 rotate-1 inline-block border-2 border-black">
										WELCOME
									</span>{' '}
									<span className="bg-about2 px-2 py-1 -rotate-1 inline-block border-2 border-black">
										TO
									</span>{' '}
									<span className="bg-about1 px-2 py-1 -rotate-1 inline-block border-2 border-black">
										SAMsoc!
									</span>
								</h1>
								<p className="max-w-full sm:max-w-[700px] text-base sm:text-lg md:text-xl text-text1 pt-14">
									Join our Anime and Manga Society at Surrey
									and watch anime screenings together or join
									us at one of our many events!
								</p>
							</div>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="https://www.instagram.com/unisamsoc/?hl=en">
									<SvgIcon
										src={Instagram.src}
										height={48}
										width={48}
										className={'bg-[#ff0069]'}
									></SvgIcon>
								</Link>
								<Link href="https://www.facebook.com/UniSAMSoc">
									<SvgIcon
										src={Facebook.src}
										height={48}
										width={48}
										className={'bg-[#0866ff]'}
									></SvgIcon>
								</Link>
								<Link href="https://www.discord.com">
									<SvgIcon
										src={Discord.src}
										height={48}
										width={48}
										className={'bg-[#5865f2]'}
									></SvgIcon>
								</Link>
							</div>
						</div>
						<div className="lg:block justify-center mt-8 lg:mt-0 flex flex-row items-center">
							<div className="mb-6 flex flex-col items-center justify-center">
								<h2
									className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter
                         bg-about1 border-2 border-black inline-block px-3 py-2 -rotate-1 mb-3"
								>
									Our Achievements
								</h2>
								<div
									className={cn(
										'rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
										'bg-card backdrop-blur-md',
										'inline-block self-start',
									)}
								>
									<ul className="space-y-2 p-4 sm:p-6">
										{' '}
										{/* Reduced vertical spacing and padding */}
										{awardsData.map((award, index) => (
											<li
												key={index}
												className="flex items-center gap-2 sm:gap-3"
											>
												<div
													className={cn(
														'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center',
														'bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-black',
														'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
													)}
												>
													<award.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white/90" />
												</div>
												<div className="flex-grow">
													<h3 className="text-sm sm:text-lg font-semibold text-text1 truncate">
														{award.title}
													</h3>
													<p className="text-xs sm:text-sm text-text1/80 truncate">
														{award.description}
													</p>
												</div>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-row py-6 items-center justify-center">
						<Button
							asChild
							className="bg-thebutton hover:bg-thebutton2 text-white text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-7 px-4 sm:px-6 md:px-8 border-2 rounded-md border-black"
						>
							<Link
								href="#join"
								className="flex items-center justify-center"
							>
								<span className="mr-2">🎉</span> Join Now!{' '}
								<ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
							</Link>
						</Button>
					</div>
				</div>
			</section>
		);
	}
}
