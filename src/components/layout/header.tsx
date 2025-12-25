'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../../public/images/logo.webp';
import { cn } from '~/lib/utils';
import { usePathname } from 'next/navigation';
import AccountButton from '~/components/shared/account-button';
import { useSession } from '~/lib/auth-client';
import { SvgIcon } from '~/components/shared/svg-icon';

const staticNavLinks = [
	{ href: '/library', label: 'Library' },
	{ href: '/events', label: 'Events' },
	{ href: '/calendar', label: 'Calendar' },
	{ href: '/gallery', label: 'Gallery' },
	{ href: '/games', label: 'Games' },
];

const adminLink = { href: '/dashboard', label: 'Dashboard' };

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const { data: session, isPending } = useSession();
	const pathname = usePathname();

	const isAdmin = !isPending && session?.user?.role === 'admin';
	const finalNavLinks = [...staticNavLinks, ...(isAdmin ? [adminLink] : [])];

	// Throttle scroll handler to improve performance
	const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastScrollYRef = useRef(0);

	// Handle Scroll Direction with throttling
	useEffect(() => {
		const handleScroll = () => {
			if (throttleTimeoutRef.current) {
				return;
			}

			throttleTimeoutRef.current = setTimeout(() => {
				const currentScrollY = window.scrollY;
				const lastScrollY = lastScrollYRef.current;

				// 1. Always show at the very top
				if (currentScrollY < 10) {
					setIsVisible(true);
				}
				// 2. Hide on scroll down, Show on scroll up
				else if (currentScrollY > lastScrollY && currentScrollY > 100) {
					setIsVisible(false);
					setIsMenuOpen(false); // Close mobile menu if user scrolls down
				} else if (currentScrollY < lastScrollY) {
					setIsVisible(true);
				}

				lastScrollYRef.current = currentScrollY;
				throttleTimeoutRef.current = null;
			}, 10); // Throttle to ~100fps max
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (throttleTimeoutRef.current) {
				clearTimeout(throttleTimeoutRef.current);
			}
		};
	}, []);

	return (
		<header
			className={cn(
				'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1000px]',
				'transition-all duration-300 ease-in-out',
				isVisible
					? 'translate-y-0 opacity-100'
					: '-translate-y-24 opacity-0',
			)}
		>
			<div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl lg:rounded-full shadow-lg overflow-hidden">
				<div className="flex h-[60px] items-center justify-between px-4 md:px-6">
					{/* Logo */}
					<Link
						href="/"
						className="relative w-10 h-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
					>
						<Image
							src={Logo}
							alt="logo"
							className="object-contain"
							fill
							sizes="40px"
							priority
						/>
					</Link>

					{/* Desktop Nav */}
					<nav className="hidden md:flex items-center gap-1">
						{finalNavLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									'px-4 py-2 rounded-full text-sm font-medium transition-colors',
									pathname === link.href
										? 'bg-black text-white'
										: 'text-black/70 hover:bg-black/5 hover:text-black',
								)}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Mobile Socials (Center) */}
					<div className="flex md:hidden gap-4 items-center">
						<SocialIcon
							href="https://discord.gg/tQUrdxzUZ4"
							src="/discord.svg"
							color="bg-[#5865F2]"
						/>
						<SocialIcon
							href="https://www.instagram.com/unisamsoc"
							src="/instagram.svg"
							color="bg-[#ff0069]"
						/>
					</div>

					{/* Right Side Actions */}
					<div className="flex items-center gap-2">
						<div className="hidden md:block">
							<AccountButton />
						</div>

						<button
							className="p-2 md:hidden text-black"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>

				{/* Mobile Menu Dropdown */}
				<div
					className={cn(
						'grid transition-all duration-300 ease-in-out md:hidden bg-white/90',
						isMenuOpen
							? 'grid-rows-[1fr] border-t'
							: 'grid-rows-[0fr]',
					)}
				>
					<div className="overflow-hidden">
						<div className="p-4 flex flex-col gap-2">
							{finalNavLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setIsMenuOpen(false)}
									className={cn(
										'px-4 py-3 rounded-lg font-medium',
										pathname === link.href
											? 'bg-black/5'
											: '',
									)}
								>
									{link.label}
								</Link>
							))}
							<div className="pt-2 mt-2 border-t">
								<AccountButton />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}

function SocialIcon({
	href,
	src,
	color,
}: {
	href: string;
	src: string;
	color: string;
}) {
	return (
		<Link
			href={href}
			target="_blank"
			className="transition-transform hover:scale-110"
		>
			<SvgIcon
				src={src}
				height={24}
				width={24}
				className={cn('rounded-md', color)}
			/>
		</Link>
	);
}
