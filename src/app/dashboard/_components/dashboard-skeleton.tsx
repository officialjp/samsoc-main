import { cn } from '~/lib/utils';

interface DashboardSkeletonProps {
	className?: string;
}

export function DashboardCardSkeleton({ className }: DashboardSkeletonProps) {
	return (
		<div
			className={cn(
				'border-2 border-gray-200 rounded-2xl bg-white p-6 animate-pulse',
				className,
			)}
		>
			<div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-gray-200">
				<div className="w-8 h-8 bg-gray-200 rounded-lg" />
				<div className="h-6 w-48 bg-gray-200 rounded" />
			</div>
			<div className="space-y-3">
				<div className="h-4 w-full bg-gray-200 rounded" />
				<div className="h-4 w-3/4 bg-gray-200 rounded" />
				<div className="h-4 w-1/2 bg-gray-200 rounded" />
			</div>
		</div>
	);
}

export function DashboardFormSkeleton({ className }: DashboardSkeletonProps) {
	return (
		<div
			className={cn(
				'border-2 border-gray-200 rounded-2xl bg-white p-6 animate-pulse',
				className,
			)}
		>
			<div className="flex items-center gap-3 pb-4 mb-4 border-b-2 border-gray-200">
				<div className="w-6 h-6 bg-gray-200 rounded" />
				<div className="h-6 w-40 bg-gray-200 rounded" />
			</div>
			<div className="space-y-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="space-y-2">
						<div className="h-4 w-24 bg-gray-200 rounded" />
						<div className="h-12 w-full bg-gray-200 rounded-xl" />
						<div className="h-3 w-48 bg-gray-200 rounded" />
					</div>
				))}
			</div>
			<div className="flex justify-end pt-4 mt-4 border-t-2 border-gray-200">
				<div className="h-10 w-32 bg-gray-200 rounded-xl" />
			</div>
		</div>
	);
}

export function DashboardTabsSkeleton({ className }: DashboardSkeletonProps) {
	return (
		<div className={cn('animate-pulse', className)}>
			<div className="flex gap-2 mb-6">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-12 flex-1 bg-gray-200 rounded-xl border-2 border-gray-200"
					/>
				))}
			</div>
			<DashboardFormSkeleton />
		</div>
	);
}

export function DashboardNavigationSkeleton({
	className,
}: DashboardSkeletonProps) {
	return (
		<div className={cn('flex gap-2 flex-wrap animate-pulse', className)}>
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					key={i}
					className="h-10 w-32 bg-gray-200 rounded-full border-2 border-gray-200"
				/>
			))}
		</div>
	);
}

export function DashboardHubSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6, 7].map((i) => (
					<DashboardCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}

export function DashboardItemListSkeleton({
	className,
	itemCount = 5,
}: DashboardSkeletonProps & { itemCount?: number }) {
	return (
		<div className={cn('space-y-3 animate-pulse', className)}>
			{Array.from({ length: itemCount }).map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl"
				>
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gray-200 rounded-lg" />
						<div className="space-y-2">
							<div className="h-4 w-32 bg-gray-200 rounded" />
							<div className="h-3 w-24 bg-gray-200 rounded" />
						</div>
					</div>
					<div className="h-8 w-8 bg-gray-200 rounded-lg" />
				</div>
			))}
		</div>
	);
}
