'use client';

export default function GallerySkeleton() {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
				{/* Sidebar skeleton */}
				<aside className="h-fit lg:sticky lg:top-24">
					<div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
						<div className="mb-6 flex items-center justify-between">
							<div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
						</div>

						{/* Category filter skeleton */}
						<div className="mb-6">
							<div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200" />
							<div className="flex flex-wrap gap-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="h-9 w-24 animate-pulse rounded border-2 border-gray-200 bg-gray-100"
									/>
								))}
							</div>
						</div>

						{/* Year filter skeleton */}
						<div className="mb-6">
							<div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
							<div className="flex flex-wrap gap-2">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-9 w-16 animate-pulse rounded border-2 border-gray-200 bg-gray-100"
									/>
								))}
							</div>
						</div>

						{/* Currently showing skeleton */}
						<div className="mt-8 border-t-2 border-gray-200 pt-6">
							<div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
							<div className="flex flex-wrap gap-2">
								<div className="h-7 w-20 animate-pulse rounded-2xl bg-pink-100" />
								<div className="h-7 w-16 animate-pulse rounded-2xl bg-cyan-100" />
							</div>
							<div className="mt-4 h-4 w-28 animate-pulse rounded bg-gray-200" />
							<div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
						</div>
					</div>
				</aside>

				{/* Main content skeleton */}
				<section>
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
						{[
							1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
						].map((i) => (
							<div
								key={i}
								className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
							>
								<div className="aspect-4/3 w-full animate-pulse bg-gray-200" />
							</div>
						))}
					</div>
				</section>
			</div>

			{/* Pagination skeleton */}
			<div className="flex items-center justify-center gap-2">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="h-10 w-10 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100"
					/>
				))}
			</div>
		</div>
	);
}
