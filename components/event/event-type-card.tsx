import Image from 'next/image'; // No need to import StaticImageData here
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import the shared type
import { EventImageType, ImageTypes } from '@/lib/definitions'; // Adjust the path as needed
import ImageCollage from '@/components/util/imageCollage';

interface EventTypeCardProps {
	title: string;
	description: string;
	frequency: string;
	image?: EventImageType; // Use the shared type
	color: string;
	examples: string[];
	collageImage?: ImageTypes[];
}

export function EventTypeCard({
	title,
	description,
	frequency,
	image,
	collageImage,
	color,
	examples,
}: EventTypeCardProps) {
	return (
		<div
			className={cn(
				'border-2 border-black p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
				color,
			)}
		>
			<div className="flex flex-col md:flex-row gap-6">
				<div className="w-full md:w-1/3">
					<div className="relative h-48 md:h-full border-4 border-black overflow-hidden">
						{collageImage && collageImage.length > 0 ? (
							<ImageCollage
								images={collageImage}
								className="h-full w-full bg-black"
							></ImageCollage>
						) : (
							<Image
								src={image || '/placeholder.svg'}
								alt={title}
								fill
								className="object-cover"
							/>
						)}
					</div>
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
