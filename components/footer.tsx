'use client';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SvgIcon } from './util/svgIcon';
//add discords
export function Footer() {
	const [isOpen, setIsOpen] = useState(false);
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
						<span>
							<Link
								href="https://github.com/officialjp"
								className="flex items-center"
							>
								J.P
							</Link>
						</span>
						<span>
							<Link
								href="https://natski.dev"
								className="flex items-center"
							>
								<SvgIcon
									className={'bg-gray-500 mr-1'}
									width={15}
									height={15}
									src={
										'https://natski.vercel.app/apis/encore/icon-system/dependencies/svg/NATSKI.svg'
									}
								></SvgIcon>
								Michael
							</Link>
						</span>
						<span>
							<Link href="" className="flex items-center">
								Maiham
							</Link>
						</span>
						<span>
							<Link
								href="https://github.com/BLT19"
								className="flex items-center"
							>
								David
							</Link>
						</span>
					</p>
				</div>
				<div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
					<div className="space-y-3">
						<h3 className="text-lg font-medium">Contact</h3>
						<nav className="flex flex-col gap-2">
							<Link
								href="mailto:Ussu.Anime@surrey.ac.uk"
								className="text-sm hover:underline"
							>
								Ussu.Anime@surrey.ac.uk
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
							<button
								className="text-sm hover:underline justify-start items-start text-start"
								onClick={() => setIsOpen(true)}
							>
								Discord
							</button>
							{isOpen && (
								<div
									className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 hover:cursor-pointer"
									onClick={() => setIsOpen(false)}
								>
									<div className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl border-4 border-black p-2 hover:cursor-default">
										<button
											className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:cursor-pointer"
											onClick={() => setIsOpen(false)}
										>
											<X className="h-6 w-6" />
										</button>
										<p className="mt-2 text-center font-medium">
											The discord link can be found in our
											Microsoft Teams, please wait up to
											24 hours to get added to the teams
											once you have acquired a membership!
										</p>
									</div>
								</div>
							)}
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
