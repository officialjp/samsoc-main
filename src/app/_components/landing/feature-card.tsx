import { cn } from '~/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
	className?: string;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
	color,
	className,
}: FeatureCardProps) {
	return (
		<div
			className={cn(
				`flex flex-col items-center space-y-4 border-2 rounded-2xl border-black ${color} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`,
				className,
			)}
		>
			<div className="flex lg:flex-col flex-row items-center justify-center gap-2">
				<div className="bg-white p-2 lg:p-4 rounded-full border-2 border-black">
					<Icon className="h-5 w-5 lg:h-10 lg:w-10" />
				</div>
				<h3 className="text-xl font-bold">{title}</h3>
			</div>
			<p className="text-center text-text1">{description}</p>
		</div>
	);
}
