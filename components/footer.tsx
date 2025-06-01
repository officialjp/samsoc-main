import Link from 'next/link';

export function Footer() {
	return (
		<footer className="border-t-2 border-black bg-white">
			<div className="container w-full max-w-full px-4 md:px-6 lg:px-8 flex flex-col gap-4 py-10 md:flex-row md:justify-between">
				<div className="flex flex-col gap-2">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold text-xl"
					>
						Surrey Anime and Manga Society
					</Link>
					<p className="text-sm text-gray-500">
						Bringing anime fans together since 2006
					</p>
					<p className="text-sm text-gray-500">
						Created by:
						<span> JP</span>,<span> Michael</span>,
						<span> Maiham </span>
						and
						<span> David</span> ❤️
					</p>
				</div>
				<div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
					<div className="space-y-3">
						<h3 className="text-lg font-medium">Contact</h3>
						<nav className="flex flex-col gap-2">
							<Link
								href="mailto:anime@university.edu"
								className="text-sm hover:underline"
							>
								anime@surrey.ac.uk
							</Link>
							<Link
								href="https://www.instagram.com/unisamsoc/?hl=en"
								className="text-sm hover:underline"
							>
								Instagram
							</Link>
							<Link
								href="https://www.facebook.com/UniSAMSoc"
								className="text-sm hover:underline"
							>
								Facebook
							</Link>
							<Link href="#" className="text-sm hover:underline">
								Discord
							</Link>
						</nav>
					</div>
				</div>
			</div>
			<div className="border-t border-gray-200 py-6 text-center">
				<p className="text-sm text-gray-700">
					© {new Date().getFullYear()} University of Surrey Anime
					Society. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
