'use client';

import Link from 'next/link';
import {
	type ReactNode,
	useEffect,
	useRef,
	useState,
	useCallback,
} from 'react';
import { SvgIcon } from './util/svg-icon';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.webp';
import { cn } from '~/lib/utils';
import { usePathname } from 'next/navigation';
import AccountButton from './login-btn';
import { useSession } from 'next-auth/react';

const staticNavLinks = [
	{ href: '/library', label: 'Library' },
	{ href: '/events', label: 'Events' },
	{ href: '/calendar', label: 'Calendar' },
	{ href: '/gallery', label: 'Gallery' },
	{ href: '/games', label: 'Games' },
];
const adminLink = { href: '/dashboard', label: 'Dashboard' };
type NavLink = (typeof staticNavLinks)[number];

function Button({
	children,
	href,
	className,
	isActive,
}: {
	children: React.ReactElement<ReactNode> | string;
	href: string;
	className?: string;
	isActive?: boolean;
}) {
	return (
		<Link
			href={href}
			className={cn(
				'px-4 relative h-full w-fit rounded-full transition duration-300 font-medium flex items-center',
				'group-hover:bg-transparent group-hover:text-black hover:bg-black hover:text-white text-black',
				isActive &&
					'bg-black text-white hover:bg-black hover:text-white',
				className,
			)}
		>
			{children}
		</Link>
	);
}

function Nav({ links }: { links: NavLink[] }) {
	const pathname = usePathname();

	return (
		<nav className="hidden md:flex gap-3 h-full mx-auto group">
			{links.map((link: NavLink) => (
				<Button
					key={link.href}
					href={link.href}
					isActive={
						pathname === link.href ||
						pathname.startsWith(`${link.href}/`)
					}
				>
					{link.label}
				</Button>
			))}
		</nav>
	);
}

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navRef = useRef<HTMLElement>(null);
	const { data: session } = useSession();

	const isAdmin = session?.user.role === 'admin';

	const finalNavLinks = [...staticNavLinks, ...(isAdmin ? [adminLink] : [])];

	const stateRef = useRef<{
		transformPosY: number;
		lastScroll: number;
		scrollBuffer: number;
		rAFId: number | null;
	}>({
		transformPosY: 0,
		lastScroll: 0,
		scrollBuffer: 0,
		rAFId: null,
	});

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const animateHeader = useCallback(() => {
		const headerElement = navRef.current;
		if (!headerElement) return;

		const state = stateRef.current;
		const scroll = window.scrollY;
		const scrollDelta = state.lastScroll - scroll;
		const hiddenHeight = -(headerElement.offsetHeight + 40);

		state.lastScroll = scroll;
		state.scrollBuffer = Math.max(state.scrollBuffer - scrollDelta, 0);
		if (state.scrollBuffer <= 300) {
			if (state.rAFId) {
				cancelAnimationFrame(state.rAFId);
				state.rAFId = null;
			}
			return;
		}

		if (state.transformPosY > hiddenHeight || scrollDelta > 0) {
			state.transformPosY = Math.min(
				Math.max(state.transformPosY + scrollDelta, hiddenHeight),
				0,
			);
		}

		const range = state.transformPosY / hiddenHeight;

		if (range <= 0 && scrollDelta > 0) {
			state.scrollBuffer = 0;
		}

		if (range >= 0.5) {
			setIsMenuOpen(false);
			headerElement.style.pointerEvents = 'none';
		} else {
			headerElement.style.pointerEvents = 'auto';
		}

		headerElement.style.opacity = (1 - range).toString();

		if (scroll <= 0) {
			headerElement.style.opacity = '1';
			state.scrollBuffer = 0;
			state.transformPosY = 0;
		}
	}, []);

	useEffect(() => {
		let isTicking = false;
		const currentRef = stateRef.current;

		const handleScroll = () => {
			if (!isTicking) {
				currentRef.rAFId = window.requestAnimationFrame(() => {
					animateHeader();
					isTicking = false;
				});
				isTicking = true;
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (currentRef.rAFId !== null) {
				cancelAnimationFrame(currentRef.rAFId);
			}
		};
	}, [animateHeader]);

	return (
		<header
			ref={navRef}
			className="fixed top-2.5 left-[50%] z-50 w-[min(calc(100%-20px),1000px)] blur-[0px] backdrop-blur-[10px] rounded-2xl lg:rounded-full shadow-[0px_5px_10px_#00000090] overflow-hidden transition-opacity transform-[translateX(-50%)]"
		>
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-2.5 flex h-[55px] py-2.5 items-center justify-between bg-linear-to-r from-[#ffcfd4a0] to-[#ffffffa0]">
				<Link
					href="/"
					className="relative w-10 h-10 flex items-center justify-center font-bold md:mr-2 rounded-full overflow-hidden shrink-0 shadow-[0,0,0px_#000000ff] hover:shadow-[0_0_10px_#00000040] active:shadow-[0_0_4px_#000000a0] hover:scale-110 active:duration-50 active:scale-105 transition duration-300"
				>
					<Image
						src={Logo}
						loading="lazy"
						className="absolute shrink-0 w-full h-full"
						alt="logo"
						draggable="false"
						height={40}
						width={40}
					/>
				</Link>

				<Nav links={finalNavLinks} />

				<div className="flex-row flex gap-6 mx-auto md:hidden">
					<Link href="https://www.instagram.com/unisamsoc/?hl=en">
						<SvgIcon
							src={'/instagram.svg'}
							height={30}
							width={30}
							className={'bg-[#ff0069]'}
						></SvgIcon>
					</Link>
					<Link href="https://www.facebook.com/UniSAMSoc">
						<SvgIcon
							src={'/facebook.svg'}
							height={30}
							width={30}
							className={'bg-[#0866ff]'}
						></SvgIcon>
					</Link>
					<Link href="https://discord.gg/tQUrdxzUZ4">
						<SvgIcon
							src={'/discord.svg'}
							height={30}
							width={30}
							className={'bg-[#5865F2]'}
						></SvgIcon>
					</Link>
				</div>

				<div className="flex items-center relative h-full">
					<button
						className=" p-2 text-black hover:cursor-pointer md:hidden"
						onClick={toggleMenu}
						aria-label="Toggle menu"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
					<div className="hidden md:flex">
						<AccountButton />
					</div>
				</div>
			</div>

			<div
				className="bg-[#ffffffa0] md:hidden grid grid-rows-[0fr] transition-[grid-template-rows] duration-400 ease-in-out"
				style={{
					gridTemplateRows: isMenuOpen ? '1fr' : '0fr',
				}}
			>
				<nav
					className="overflow-hidden transition-opacity duration-400"
					style={{
						opacity: isMenuOpen ? '1' : '0',
					}}
				>
					<div className="p-4 flex flex-col space-y-4 border-black border-t">
						{finalNavLinks.map((link: NavLink) => (
							<Link
								key={link.href}
								href={link.href}
								className="font-medium py-2 hover:underline underline-offset-4"
								onClick={() => setIsMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<AccountButton />
					</div>
				</nav>
			</div>
		</header>
	);
}
