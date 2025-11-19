import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { cn } from '~/lib/utils';

interface EventTypeCardProps {
	title: string;
	description: string;
	frequency: string;
	image?: string;
	color: string;
	examples: string[];
	className?: string;
}

interface Image {
	alt: string;
	src: string;
	dimentions: Dimensions;
}

interface Dimensions {
	x: number;
	y: number;
}

export function EventTypeCard({
	title,
	description,
	frequency,
	image,
	color,
	examples,
	className,
}: EventTypeCardProps) {
	return (
		<div
			className={cn(
				'border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
				color,
				className,
			)}
		>
			<div className="flex flex-col md:flex-row gap-6 items-center">
				<div className="relative w-[min(100%,400px)] aspect-video border-4 shrink-0 border-black overflow-hidden rounded-md">
					<Image
						src={image ?? '/placeholder.svg'}
						alt={title}
						fill
						sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
						className="object-cover"
					/>
				</div>

				<div className="w-full md:w-2/3 space-y-4">
					<h3 className="text-2xl font-bold">{title}</h3>

					<div className="flex items-center">
						<Calendar className="h-5 w-5 mr-2" />
						<span className="text-sm font-medium">{frequency}</span>
					</div>

					<p className="text-gray-800">{description}</p>

					<div className="pt-4">
						<h4 className="text-sm font-bold uppercase mb-2">
							Recent Examples:
						</h4>
						<div className="flex flex-wrap gap-2">
							{examples.map((example, index) => (
								<span
									key={index}
									className="bg-white/60 px-3 py-1 text-sm border-2 border-black rounded-full"
								>
									{example}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
