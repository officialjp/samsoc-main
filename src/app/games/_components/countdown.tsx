'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownProps {
	label?: string;
	updateInterval?: number; // in milliseconds, default 1000 (1 second)
}

export default function Countdown({
	label = 'Next game in:',
	updateInterval = 1000,
}: CountdownProps) {
	const [timeLeft, setTimeLeft] = useState('');

	useEffect(() => {
		const calculate = () => {
			const now = new Date();
			const tomorrow = new Date();
			tomorrow.setUTCHours(24, 0, 0, 0);
			const diff = tomorrow.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft('0h 0m');
				return;
			}

			const h = Math.floor(diff / 3600000);
			const m = Math.floor((diff % 3600000) / 60000);
			const s = Math.floor((diff % 60000) / 1000);

			// Show seconds if less than 1 hour remaining
			if (h === 0) {
				setTimeLeft(`${m}m ${s}s`);
			} else {
				setTimeLeft(`${h}h ${m}m`);
			}
		};

		calculate();
		const timer = setInterval(calculate, updateInterval);
		return () => clearInterval(timer);
	}, [updateInterval]);

	return (
		<div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white/50 px-3 py-1.5 rounded-full border border-black/10">
			<Timer className="w-4 h-4 text-blue-600" aria-hidden="true" />
			<span>
				{label} {timeLeft}
			</span>
		</div>
	);
}
