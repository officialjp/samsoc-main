'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SvgIcon } from '@/components/util/svgIcon';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import Instagram from '@/public/instagram.svg';
import Facebook from '@/public/facebook.svg';
import Discord from '@/public/discord.svg';

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navRef = useRef(null);

	let transformPosY = 0;
	let lastScroll = 0;

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const animateOnScrollController = (self: any) => {
		const scroll = window.scrollY;

		if (scroll <= 0) {
			self.style.opacity = '1';
			self.style.filter = 'blur(0px)';
			return;
		}

		const scrollDelta = lastScroll - scroll;
		const hiddenHeight = self.offsetHeight + 40;

		lastScroll = scroll;

		if (transformPosY < hiddenHeight || scrollDelta > 0) {
			transformPosY = Math.min(
				Math.max(transformPosY + scrollDelta, -hiddenHeight),
				0,
			);
		}

		let range = transformPosY / -hiddenHeight;

		if (range >= 0.5) {
			setIsMenuOpen(false);
		}

		self.style.opacity = (1 - range).toString();
		self.style.filter = `blur(${range * 5}px)`;
	};

	useEffect(() => {
		window.addEventListener('scroll', () => {
			animateOnScrollController(navRef.current);
		});
		return () =>
			window.removeEventListener('scroll', () => {
				animateOnScrollController(navRef.current);
			});
	}, []);

	return (
		<header
			ref={navRef}
			className="fixed top-0 z-50 w-full border-b-2 border-black bg-white"
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-xl md:mr-2"
				>
					<Image
						src={Logo}
						className="border-1 border-black rounded-[50%] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rotate-2"
						alt="logo"
						height={48}
						width={48}
					/>
				</Link>
				<div className="flex-row flex gap-6 lg:hidden">
					<Link href="https://www.instagram.com/unisamsoc/?hl=en">
						<SvgIcon
							src={Instagram.src}
							height={30}
							width={30}
							className={'bg-[#ff0069]'}
						></SvgIcon>
					</Link>
					<Link href="https://www.facebook.com/UniSAMSoc">
						<SvgIcon
							src={Facebook.src}
							height={30}
							width={30}
							className={'bg-[#0866ff]'}
						></SvgIcon>
					</Link>
					<button onClick={() => setIsOpen(true)}>
						<SvgIcon
							src={Discord.src}
							height={32}
							width={32}
							className="bg-[#7289da]"
						></SvgIcon>
					</button>
					{isOpen && (
						<div
							className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 hover:cursor-pointer"
							onClick={() => setIsOpen(false)}
						>
							<div className="relative max-w-5xl max-h-[90vh] bg-white rounded-md border-4 border-black p-2 hover:cursor-default">
								<button
									className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:cursor-pointer"
									onClick={() => setIsOpen(false)}
								>
									<X className="h-6 w-6" />
								</button>
								<p className="mt-2 text-center font-medium">
									The discord link can be found in our
									Microsoft Teams, please wait up to 24 hours
									to get added to the teams once you have
									acquired a membership!
								</p>
							</div>
						</div>
					)}
				</div>
				<nav className="hidden md:flex gap-6 ml-auto pr-6">
					<Link
						href="/library"
						className="font-medium hover:underline underline-offset-4"
					>
						Library
					</Link>
					<Link
						href="/events"
						className="font-medium hover:underline underline-offset-4"
					>
						Events
					</Link>
					<Link
						href="/calendar"
						className="font-medium hover:underline underline-offset-4"
					>
						Calendar
					</Link>
					<Link
						href="/gallery"
						className="font-medium hover:underline underline-offset-4"
					>
						Gallery
					</Link>
					<Link
						href="/hof"
						className="font-medium hover:underline underline-offset-4"
					>
						Hall of Fame
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					<Link href="/#join" className="hidden sm:block">
						<Button className="bg-pink-500 cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							Join Now
						</Button>
					</Link>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 text-black hover:cursor-pointer"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden px-4 py-4 bg-white border-t border-gray-200">
					<nav className="flex flex-col space-y-4">
						<Link
							href="/library"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Library
						</Link>
						<Link
							href="/events"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Events
						</Link>
						<Link
							href="/calendar"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Calendar
						</Link>
						<Link
							href="/gallery"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Gallery
						</Link>
						<Link
							href="/hof"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Hall of Fame
						</Link>
						<Link
							href="#join"
							className="sm:hidden"
							onClick={() => setIsMenuOpen(false)}
						>
							<Button className="w-full bg-pink-500 cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
								Join Now
							</Button>
						</Link>
					</nav>
				</div>
			)}
		</header>
	);
}
