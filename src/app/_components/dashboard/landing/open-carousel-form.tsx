'use client';

import { useState } from 'react';
import CarouselForm from './carousel-form';
import { Button } from '../../ui/button';

export default function OpenFormButton() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleForm = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<Button
				onClick={toggleForm}
				className="bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
			>
				{isOpen ? 'Close Form' : 'Open Carousel Form'}
			</Button>
			{isOpen && <CarouselForm />}
		</div>
	);
}
