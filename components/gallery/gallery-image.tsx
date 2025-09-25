'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import InView from '@/components/scroll-view-card';

interface GalleryImageProps {
	src: string;
	alt: string;
	width: number;
	height: number;
}

export function GalleryImage({ src, alt, width, height }: GalleryImageProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div
				className="overflow-hidden border-2 rounded-2xl border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black cursor-pointer transition-transform hover:scale-[1.02]"
				onClick={() => setIsOpen(true)}
			>
				<Image
					src={src || '/placeholder.svg'}
					width={width}
					height={height}
					alt={alt}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					className="aspect-video object-cover"
				/>
			</div>

			{isOpen && (
				<div
					className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 hover:cursor-pointer"
					onClick={() => setIsOpen(false)}
				>
					<div className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl border-4 border-black p-2 hover:cursor-default">
						<button
							className="absolute -top-4 -right-4 bg-pink-500 text-white rounded-full p-1 border-2 border-black hover:cursor-pointer"
							onClick={() => setIsOpen(false)}
						>
							<X className="h-6 w-6" />
						</button>
						<Image
							src={src || '/placeholder.svg'}
							width={1200}
							height={800}
							alt={alt}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="max-h-[80vh] w-auto object-contain"
						/>
						<p className="mt-2 text-center font-medium">{alt}</p>
					</div>
				</div>
			)}
		</>
	);
}
