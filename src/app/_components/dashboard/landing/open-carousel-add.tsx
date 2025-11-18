'use client';

import { useState } from 'react';
import CarouselForm from './carousel-add';
import { Button } from '../../ui/button';
import { cn } from '~/lib/utils';

export default function OpenFormButton() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleForm = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div
			className={cn('flex items-center justify-center flex-col gap-4', {
				'bg-blue-200 border border-black rounded-2xl p-4': isOpen,
			})}
		>
			<Button
				onClick={toggleForm}
				className="bg-button2 hover:bg-button1 hover:cursor-pointer"
			>
				{isOpen ? 'Close' : 'Add Carousel Item'}
			</Button>
			{isOpen && <CarouselForm />}
		</div>
	);
}
