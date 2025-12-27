'use client';

import { Loader2 } from 'lucide-react';

interface GameSkeletonProps {
	gameType?: 'wordle' | 'studio' | 'banner';
}

export default function GameSkeleton({
	gameType = 'wordle',
}: GameSkeletonProps) {
	return (
		<div className="max-w-7xl mx-auto p-4 md:p-8">
			<div className="flex flex-col lg:flex-row gap-8">
				<div className="flex-1">
					{/* Content skeleton based on game type */}
					{gameType === 'wordle' && (
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="border-2 border-gray-200 rounded-2xl bg-white p-4 md:p-6"
								>
									<div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3" />
									<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
										{[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
											<div
												key={j}
												className="h-16 bg-gray-100 rounded-lg animate-pulse"
											/>
										))}
									</div>
								</div>
							))}
						</div>
					)}

					{gameType === 'studio' && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2, 3, 4, 5].map((i) => (
								<div
									key={i}
									className="bg-white border-2 border-gray-200 rounded-2xl p-6"
								>
									<div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
									<div className="h-6 w-full bg-gray-100 rounded animate-pulse" />
								</div>
							))}
						</div>
					)}

					{gameType === 'banner' && (
						<div className="space-y-6">
							{/* Image placeholder */}
							<div className="border-2 border-gray-200 rounded-2xl bg-gray-100 p-4 max-w-xs mx-auto">
								<div
									className="w-full aspect-3/4 bg-gray-200 rounded-lg animate-pulse"
									style={{ maxHeight: '400px' }}
								/>
								<div className="mt-3 h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
							</div>

							{/* Progress bar placeholder */}
							<div className="border-2 border-gray-200 rounded-xl bg-white p-4">
								<div className="h-3 w-40 bg-gray-200 rounded animate-pulse mb-2" />
								<div className="flex gap-2">
									{[1, 2, 3, 4, 5, 6].map((i) => (
										<div
											key={i}
											className="flex-1 h-2 rounded-full bg-gray-200 animate-pulse"
										/>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Loading indicator */}
					<div className="flex items-center justify-center gap-3 mt-8 text-gray-500">
						<Loader2 className="w-5 h-5 animate-spin" />
						<span className="text-sm font-medium">
							Loading game data...
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
