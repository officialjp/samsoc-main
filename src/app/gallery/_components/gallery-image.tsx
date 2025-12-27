'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import posthog from 'posthog-js';

interface GalleryImageProps {
	src: string;
	alt: string;
	thumbnailSrc?: string | null;
}

export default function GalleryImage({
	src,
	alt,
	thumbnailSrc,
}: GalleryImageProps) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
		posthog.capture('gallery_image_viewed', {
			image_alt: alt,
		});
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};

		document.addEventListener('keydown', handleEscape);
		document.body.style.overflow = 'hidden';

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, closeModal]);

	return (
		<>
			<button
				className="overflow-hidden rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
				onClick={openModal}
				aria-label={`View full size image: ${alt}`}
				type="button"
			>
				<Image
					src={thumbnailSrc ?? src}
					width={600}
					height={400}
					alt={alt}
					loading="lazy"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="aspect-video object-cover"
				/>
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
					onClick={closeModal}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
				>
					<div
						className="relative max-h-[90vh] max-w-5xl rounded-2xl border-4 border-black bg-white p-2"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute -right-4 -top-4 rounded-full border-2 border-black bg-pink-500 p-1 text-white transition-colors hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
							onClick={closeModal}
							aria-label="Close modal"
							type="button"
						>
							<X className="h-6 w-6" />
						</button>

						<div className="relative">
							<Image
								src={src}
								width={1200}
								height={800}
								alt={alt}
								className="max-h-[80vh] w-auto object-contain"
								sizes="90vw"
							/>
						</div>
						<p
							id="modal-title"
							className="mt-2 text-center font-medium text-gray-900"
						>
							{alt}
						</p>
					</div>
				</div>
			)}
		</>
	);
}
