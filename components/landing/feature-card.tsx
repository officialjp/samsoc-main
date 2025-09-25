import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
	color,
}: FeatureCardProps) {
	return (
		<div
			className={`flex flex-col items-center space-y-4 border-2 rounded-md border-black ${color} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
		>
			<div className="bg-white p-4 rounded-full border-2 border-black">
				<Icon className="h-10 w-10" />
			</div>
			<h3 className="text-xl font-bold">{title}</h3>
			<p className="text-center text-text1">{description}</p>
		</div>
	);
}
