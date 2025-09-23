'use client';

import Link from 'next/link';
import {
	MouseEventHandler,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';

import { SvgIcon } from '@/components/util/svgIcon';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/public/images/logo.png';
import Instagram from '@/public/instagram.svg';
import Facebook from '@/public/facebook.svg';
import Discord from '@/public/discord.svg';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import path from 'path';

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
				'px-4 relative h-full w-fit rounded-[100vmax] group-hover:bg-transparent group-hover:text-black hover:bg-black hover:text-white text-black transition duration-300 font-medium flex items-center',
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
		<Button href="/library" className="">
			Library
		</Button>,

		<Button href="/events" className="">
			Events
		</Button>,

		<Button href="/calendar" className="">
			Calendar
		</Button>,

		<Button href="/gallery" className="">
			Gallery
		</Button>,

		<Button href="/hof" className="">
			Hall of Fame
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
	const [isOpen, setIsOpen] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navRef = useRef(null);

	let transformPosY = 0;
	let lastScroll = 0;
	let scrollBuffer = 0;

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const animateOnScrollController = (self: any) => {
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
			self.style.pointerEvents = null;
		}

		self.style.opacity = (1 - range).toString();
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
			className="fixed top-[10px] left-[50%] transform-[translateX(-50%)] z-50 w-[min(calc(100%-20px),1000px)] bg-[#ffffffa0] blur-[0px] backdrop-blur-[10px] rounded-2xl lg:rounded-[100vmax] shadow-[0px_5px_10px_#00000090]"
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-[10px] flex h-[55px] py-[10px] items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold text-xl md:mr-2"
				>
					<Image
						src={Logo}
						className="rounded-[50%] shrink-0 shadow-[0,0,10px_transparent] hover:shadow-[0_0_10px_#00000090] active:shadow-[0_0_10px_#00000040] hover:scale-110 active:duration-50 active:scale-105 transition duration-300"
						alt="logo"
						height={40}
						width={40}
					/>
				</Link>
				<div className="flex-row flex gap-6 lg:hidden mx-auto">
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
				<Nav></Nav>

				<div className="flex items-center relative h-full">
					<Button
						href="/#join"
						className="bg-button2 hover:bg-button1 text-white hidden md:flex"
					>
						Join Now
					</Button>
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
				<div className="md:hidden px-4 py-4 border-t border-black">
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

						<Button
							className="sm:hidden w-full bg-pink-500 py-2 flex justify-center cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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
