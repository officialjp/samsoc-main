import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageProps } from '@/lib/definitions';

export default function ImageCollage({ images, className }: ImageProps) {
	return (
		<div
			className={cn(
				'relative flex justify-center items-center',
				className,
			)}
		>
			<div className="relative shrink-0 h-full w-[calc(100%*(1+sin(30deg)))] overflow-hidden flex justify-center">
				{images?.map((image, index) => {
					return (
						<span
							key={image.alt + index}
							className="shrink-0 mx-0.5 relative overflow-hidden flex justify-center items-center transform-[skewX(10deg)] grow"
						>
							<div className="absolute w-[160%] lg:w-[120%] h-full flex items-center justify-center">
								<Image
									className="absolute shrink-0 w-full h-full object-cover transform-[skewX(-10deg)]"
									src={image.src || '/placeholder.svg'}
									alt={image.alt}
									width={image.dimentions.x}
									height={image.dimentions.y}
								></Image>
							</div>
						</span>
					);
				})}
			</div>
		</div>
	);
}
