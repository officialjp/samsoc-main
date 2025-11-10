'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { SvgIcon } from './util/svg-icon';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.png';
import Instagram from '../../../public/instagram.svg';
import Facebook from '../../../public/facebook.svg';
import Discord from '../../../public/discord.svg';
import { cn } from '~/lib/utils';
import { usePathname } from 'next/navigation';

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		// Only execute on the client-side
		if (typeof window !== 'undefined') {
			// Handler to call on window resize
			function handleResize() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}

			// Add event listener
			window.addEventListener('resize', handleResize);

			// Call handler initially to set size
			handleResize();

			// Remove event listener on cleanup
			return () => window.removeEventListener('resize', handleResize);
		}
	}, []);

	return windowSize;
}
function Button({
	children,
	href,
	className,
}: {
	children: React.ReactElement<ReactNode> | string;
	href: string;
	className?: string;
}) {
	return (
		<Link
			href={href}
			className={cn(
				'px-4 relative h-full w-fit rounded-full group-hover:bg-transparent group-hover:text-black hover:bg-black hover:text-white text-black transition duration-300 font-medium flex items-center',
				className,
			)}
		>
			{children}
		</Link>
	);
}

function Nav() {
	const rootName = usePathname()
		.toLowerCase()
		.replaceAll('%20', ' ')
		.replaceAll('_', ' ')
		.replaceAll('-', ' ')
		.split(/(?="\/")/g);

	const pathName = rootName[rootName.length - 1];

	const buttons = [
		<Button key={1} href="/library" className="">
			Library
		</Button>,

		<Button key={2} href="/events" className="">
			Events
		</Button>,

		<Button key={3} href="/calendar" className="">
			Calendar
		</Button>,

		<Button key={4} href="/gallery" className="">
			Gallery
		</Button>,

		<Button key={5} href="/hof" className="">
			Hall of Fame
		</Button>,

		<Button key={6} href="/games" className="">
			Games
		</Button>,
	];

	return (
		<nav className="hidden md:flex gap-3 h-full mx-auto group">
			{...buttons.map((button) => {
				if (button.props.href === pathName) {
					return (
						<Button
							key={button.props.href}
							href={button.props.href}
							className="bg-black text-white"
						>
							{button.props.children}
						</Button>
					);
				}
				return (
					<Button key={button.props.href} href={button.props.href}>
						{button.props.children}
					</Button>
				);
			})}
		</nav>
	);
}

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navRef = useRef(null);

	let transformPosY = 0;
	let lastScroll = 0;
	let scrollBuffer = 0;

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const animateOnScrollController = (self: HTMLElement) => {
		const scroll = window.scrollY;

		const scrollDelta = lastScroll - scroll;
		const hiddenHeight = -(self.offsetHeight + 40);

		lastScroll = scroll;

		scrollBuffer = Math.max(scrollBuffer - scrollDelta, 0);

		if (scrollBuffer <= 300) return;

		if (scroll <= 0) {
			self.style.opacity = '1';
			scrollBuffer = 0;
			return;
		}

		if (transformPosY > hiddenHeight || scrollDelta > 0) {
			transformPosY = Math.min(
				Math.max(transformPosY + scrollDelta, hiddenHeight),
				0,
			);
		}

		const range = transformPosY / hiddenHeight;

		if (range <= 0 && scrollDelta > 0) scrollBuffer = 0;

		if (range >= 0.5) {
			setIsMenuOpen(false);
			self.style.pointerEvents = 'none';
		} else {
			self.style.pointerEvents = '';
		}

		self.style.opacity = (1 - range).toString();
	};

	useEffect(() => {
		window.addEventListener('scroll', () => {
			if (navRef.current) animateOnScrollController(navRef.current);
		});
		return () =>
			window.removeEventListener('scroll', () => {
				if (navRef.current) animateOnScrollController(navRef.current);
			});
	}, []);

	const { width } = useWindowSize();

	const useMobile = width < 1000;

	return (
		<header
			ref={navRef}
			className="fixed top-[10px] left-[50%] transform-[translateX(-50%)] z-50 w-[min(calc(100%-20px),1000px)] blur-[0px] backdrop-blur-[10px] rounded-2xl lg:rounded-full shadow-[0px_5px_10px_#00000090] overflow-hidden"
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-[10px] flex h-[55px] py-[10px] items-center justify-between bg-gradient-to-r from-[#ffcfd4a0] to-[#ffffffa0]">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-xl md:mr-2"
				>
					<Image
						src={Logo}
						loading="lazy"
						className="rounded-full shrink-0 shadow-[0,0,10px_transparent] hover:shadow-[0_0_10px_#00000090] active:shadow-[0_0_10px_#00000040] hover:scale-110 active:duration-50 active:scale-105 transition duration-300"
						alt="logo"
						height={40}
						width={40}
					/>
				</Link>

				{!useMobile ? (
					<Nav></Nav>
				) : (
					<div className="flex-row flex gap-6 mx-auto">
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
						<Link href="https://discord.gg/tQUrdxzUZ4">
							<SvgIcon
								src={Discord.src}
								height={30}
								width={30}
								className={'bg-[#5865F2]'}
							></SvgIcon>
						</Link>
					</div>
				)}

				<div className="flex items-center relative h-full">
					{useMobile ? (
						<button
							className=" p-2 text-black hover:cursor-pointer"
							onClick={toggleMenu}
							aria-label="Toggle menu"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					) : (
						<Button
							href="/#join"
							className="bg-button2 hover:bg-button1 text-white hidden md:flex"
						>
							Join Now
						</Button>
					)}

					{/* Mobile Menu Button */}
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="px-4 py-4 border-t border-black bg-[#ffffffa0] lg:hidden">
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
							href="/games"
							className="font-medium py-2 hover:underline underline-offset-4"
							onClick={() => setIsMenuOpen(false)}
						>
							Games
						</Link>

						<Button
							className=" w-full bg-pink-500 py-2 flex justify-center cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
							href="/#join"
						>
							Join Now
						</Button>
					</nav>
				</div>
			)}
		</header>
	);
}
