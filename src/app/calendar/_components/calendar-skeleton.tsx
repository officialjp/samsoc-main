'use client';

export default function CalendarSkeleton() {
	return (
		<div className="space-y-8">
			{/* Calendar container */}
			<div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] md:p-6">
				{/* Header skeleton */}
				<div className="mb-6 flex items-center justify-between">
					{/* Previous button skeleton */}
					<div className="h-10 w-10 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100" />

					{/* Month/Year skeleton */}
					<div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

					{/* Next button skeleton */}
					<div className="h-10 w-10 animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100" />
				</div>

				{/* Desktop calendar view skeleton */}
				<div className="hidden md:block">
					{/* Days of week skeleton */}
					<div className="mb-2 grid grid-cols-7 gap-2">
						{[1, 2, 3, 4, 5, 6, 7].map((i) => (
							<div
								key={i}
								className="h-6 w-full animate-pulse rounded bg-gray-200"
							/>
						))}
					</div>

					{/* Calendar cells skeleton */}
					<div className="grid grid-cols-7 gap-2">
						{Array.from({ length: 35 }).map((_, i) => (
							<div
								key={i}
								className="aspect-square min-h-[100px] animate-pulse rounded-lg border-2 border-gray-200 bg-gray-50 p-2"
							>
								{/* Date number skeleton */}
								<div className="mb-2 h-5 w-6 rounded bg-gray-200" />

								{/* Event indicators skeleton */}
								<div className="space-y-1">
									{i % 3 === 0 && (
										<div className="h-6 w-full animate-pulse rounded bg-purple-100" />
									)}
									{i % 5 === 0 && (
										<div className="h-6 w-full animate-pulse rounded bg-pink-100" />
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Mobile calendar view skeleton */}
				<div className="md:hidden">
					{/* Date picker skeleton */}
					<div className="mb-4 h-10 w-full animate-pulse rounded-lg border-2 border-gray-200 bg-gray-100" />

					{/* Event list skeleton */}
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4"
							>
								{/* Event title skeleton */}
								<div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />

								{/* Event details skeleton */}
								<div className="mb-1 h-4 w-1/2 animate-pulse rounded bg-gray-100" />
								<div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Color guide skeleton */}
			<div className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] md:p-6">
				{/* Title skeleton */}
				<div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200" />

				{/* Legend items skeleton */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex items-center">
							<div className="mr-2 h-4 w-4 animate-pulse rounded border border-gray-200 bg-gray-100" />
							<div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
