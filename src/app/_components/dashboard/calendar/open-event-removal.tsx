'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';
import { cn } from '~/lib/utils';
import EventRemove from './event-removal';

export default function OpenRemovalButton() {
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
				{isOpen ? 'Close' : 'Remove Event Item'}
			</Button>
			{isOpen && <EventRemove />}
		</div>
	);
}
