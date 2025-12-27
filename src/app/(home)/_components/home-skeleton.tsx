'use client';

import { Check } from 'lucide-react';

export default function HomeSkeleton() {
	return (
		<main className="flex min-h-screen w-full flex-col">
			{/* Hero Carousel Section Skeleton */}
			<section className="flex w-full flex-col items-center justify-center pb-3 pt-0 md:pt-3 lg:pt-[3vh]">
				<div className="container w-full max-w-full px-0 md:px-6 lg:px-8">
					{/* Carousel skeleton */}
					<div className="mx-auto aspect-9/16 w-full max-w-[min(1200px,calc(100%-20px))] animate-pulse rounded-2xl bg-gray-200 md:aspect-video md:rounded-4xl" />
				</div>

				{/* Marquee section skeleton */}
				<div className="mt-8 w-full overflow-hidden">
					<div className="flex gap-8">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="h-8 w-32 shrink-0 animate-pulse rounded bg-gray-200"
							/>
						))}
					</div>
				</div>
			</section>

			{/* About Section Skeleton */}
			<section className="w-full px-4 py-12 md:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					{/* Section heading skeleton */}
					<div className="mb-12 text-center">
						<div className="mx-auto mb-4 h-6 w-24 animate-pulse rounded-full bg-purple-100" />
						<div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded bg-gray-200" />
						<div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-100" />
					</div>

					{/* Feature cards skeleton */}
					<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
							>
								<div className="mb-4 h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
								<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
								<div className="h-4 w-full animate-pulse rounded bg-gray-100" />
								<div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-gray-100" />
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Anime Section Skeleton */}
			<section className="w-full overflow-hidden px-4 py-12 md:px-6 md:py-16 lg:px-8">
				<div className="mx-auto max-w-7xl">
					{/* Section heading skeleton */}
					<div className="mb-12 text-center">
						<div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-purple-100" />
						<div className="mx-auto mb-4 h-10 w-80 animate-pulse rounded bg-gray-200" />
						<div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-100" />
					</div>

					{/* Anime cards skeleton */}
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
							>
								<div className="aspect-3/4 w-full animate-pulse bg-gray-200" />
								<div className="p-4">
									<div className="mb-2 h-5 w-full animate-pulse rounded bg-gray-200" />
									<div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
									<div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Library Section Skeleton */}
			<section className="w-full px-4 py-12 md:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					{/* Section heading skeleton */}
					<div className="mb-12 text-center">
						<div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-purple-100" />
						<div className="mx-auto mb-4 h-10 w-96 animate-pulse rounded bg-gray-200" />
						<div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
					</div>

					<div className="flex flex-col items-center justify-center py-12">
						{/* Library image with stats skeleton */}
						<div className="relative">
							<div className="h-[180px] w-[320px] animate-pulse rounded-2xl border-2 border-gray-200 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] md:h-[300px] md:w-[540px] lg:h-[450px] lg:w-[800px]" />

							{/* Stats card skeleton */}
							<div className="absolute -bottom-20 -left-4 rotate-3 rounded-2xl border-2 border-gray-200 bg-white p-2 lg:-left-10 lg:p-4 md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
								<div className="mb-1 h-5 w-28 animate-pulse rounded bg-gray-200 md:mb-2 md:h-6" />
								<ul className="space-y-0.5 md:space-y-1">
									{[1, 2, 3, 4].map((i) => (
										<li
											key={i}
											className="flex items-center text-xs sm:text-sm"
										>
											<Check className="mr-1 h-3 w-3 text-gray-300 md:mr-2 md:h-4 md:w-4" />
											<div className="h-3 w-32 animate-pulse rounded bg-gray-100 md:h-4" />
										</li>
									))}
								</ul>
							</div>
						</div>

						{/* Button skeleton */}
						<div className="mt-32 h-10 w-48 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
					</div>
				</div>
			</section>

			{/* Committee Section Skeleton */}
			<section className="w-full px-4 py-12 md:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					{/* Section heading skeleton */}
					<div className="mb-12 text-center">
						<div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-purple-100" />
						<div className="mx-auto mb-4 h-10 w-72 animate-pulse rounded bg-gray-200" />
						<div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-100" />
					</div>

					{/* Committee cards skeleton */}
					<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div
								key={i}
								className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
							>
								<div className="aspect-square w-full animate-pulse bg-gray-200" />
								<div className="p-4 text-center">
									<div className="mx-auto mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
									<div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-gray-100" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Membership Section Skeleton */}
			<section className="w-full px-4 py-12 md:px-6 lg:px-8">
				<div className="mx-auto max-w-7xl">
					{/* Section heading skeleton */}
					<div className="mb-12 text-center">
						<div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded-full bg-purple-100" />
						<div className="mx-auto mb-4 h-10 w-80 animate-pulse rounded bg-gray-200" />
						<div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
					</div>

					{/* Membership cards skeleton */}
					<div className="flex items-center justify-center py-8">
						<div className="grid w-full gap-8 md:grid-cols-2 lg:w-4xl">
							{[1, 2].map((i) => (
								<div
									key={i}
									className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
								>
									{/* Title and price skeleton */}
									<div className="mb-6 text-center">
										<div className="mx-auto mb-2 h-8 w-32 animate-pulse rounded bg-gray-200" />
										<div className="mx-auto mb-2 h-10 w-20 animate-pulse rounded bg-gray-200" />
										<div className="mx-auto h-4 w-48 animate-pulse rounded bg-gray-100" />
									</div>

									{/* Features skeleton */}
									<div className="space-y-3">
										{[1, 2, 3, 4, 5].map((j) => (
											<div
												key={j}
												className="flex items-center"
											>
												<Check className="mr-2 h-5 w-5 text-gray-300" />
												<div className="h-4 w-full animate-pulse rounded bg-gray-100" />
											</div>
										))}
									</div>

									{/* Button skeleton */}
									<div className="mt-6 h-10 w-full animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100" />
								</div>
							))}
						</div>
					</div>

					{/* Sign up button skeleton */}
					<div className="flex justify-center">
						<div className="h-10 w-52 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" />
					</div>
				</div>
			</section>
		</main>
	);
}
