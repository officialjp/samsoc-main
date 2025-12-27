'use client';

import { BookOpen } from 'lucide-react';

export default function LibrarySkeleton() {
	return (
		<div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
			{/* Sidebar skeleton */}
			<aside className="h-fit lg:sticky lg:top-24">
				{/* Filters skeleton */}
				<div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
					<div className="mb-6 flex items-center justify-between">
						<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
					</div>

					{/* Search skeleton */}
					<div className="mb-6">
						<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
						<div className="h-10 w-full animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100" />
					</div>

					{/* Availability skeleton */}
					<div className="mb-6">
						<div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-9 w-20 animate-pulse rounded border-2 border-gray-200 bg-gray-100"
								/>
							))}
						</div>
					</div>

					{/* Genre skeleton */}
					<div>
						<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-9 w-20 animate-pulse rounded border-2 border-gray-200 bg-gray-100"
								/>
							))}
						</div>
					</div>
				</div>

				{/* Library rules skeleton */}
				<div className="mt-6 rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
					<div className="mb-2 flex items-center">
						<BookOpen className="mr-2 h-5 w-5 text-gray-300" />
						<div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
					</div>
					<div className="space-y-2">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-4 w-full animate-pulse rounded bg-gray-100"
							/>
						))}
					</div>
				</div>
			</aside>

			{/* Main content skeleton */}
			<section id="manga-results">
				{/* Results count skeleton */}
				<div className="mb-4 h-4 w-48 animate-pulse rounded bg-gray-200" />

				{/* Manga cards grid skeleton */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
						<article
							key={i}
							className="flex flex-row items-center rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
						>
							{/* Image skeleton */}
							<div className="relative mr-4 h-48 w-32 shrink-0 animate-pulse rounded border-2 border-gray-200 bg-gray-100" />

							{/* Content skeleton */}
							<div className="flex-1">
								{/* Title skeleton */}
								<div className="mb-1 h-6 w-full animate-pulse rounded bg-gray-200" />
								<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />

								{/* Author/Volume skeleton */}
								<div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-100" />

								{/* Genres skeleton */}
								<div className="mb-3 flex flex-wrap gap-2">
									{[1, 2, 3].map((j) => (
										<div
											key={j}
											className="h-6 w-16 animate-pulse rounded-full bg-gray-100"
										/>
									))}
								</div>

								{/* Status skeleton */}
								<div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
							</div>
						</article>
					))}
				</div>

				{/* Pagination skeleton */}
				<div className="mt-8 flex items-center justify-center gap-2">
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className="h-10 w-10 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100"
						/>
					))}
				</div>
			</section>
		</div>
	);
}
