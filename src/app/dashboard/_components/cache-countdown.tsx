'use client';

import { useState, useEffect, useCallback } from 'react';
import { Timer } from 'lucide-react';

interface CacheCountdownProps {
	/** Cache TTL in seconds */
	ttlSeconds: number;
	/** Label prefix shown before the countdown */
	label?: string;
	/** Tick interval in ms (default 1000) */
	updateInterval?: number;
}

/**
 * Displays an approximate countdown showing when Prisma Accelerate's
 * TTL-based cache will next refresh public site data.
 *
 * The countdown starts from the TTL duration on mount and loops.
 * It's an approximation — the actual Accelerate cache timer starts
 * when the cache entry is created (on a cache miss), which we can't
 * observe from the client.
 */
export default function CacheCountdown({
	ttlSeconds,
	label = 'Public site refreshes in ~',
	updateInterval = 1000,
}: CacheCountdownProps) {
	const [secondsLeft, setSecondsLeft] = useState(ttlSeconds);

	const formatTime = useCallback((totalSeconds: number) => {
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = totalSeconds % 60;

		if (h > 0) {
			return `${h}h ${m}m`;
		}
		return `${m}m ${s}s`;
	}, []);

	useEffect(() => {
		setSecondsLeft(ttlSeconds);
	}, [ttlSeconds]);

	useEffect(() => {
		const tick = () => {
			setSecondsLeft((prev) => {
				if (prev <= 1) return ttlSeconds;
				return prev - 1;
			});
		};

		const timer = setInterval(tick, updateInterval);
		return () => clearInterval(timer);
	}, [ttlSeconds, updateInterval]);

	return (
		<div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-white/50 px-3 py-1.5 rounded-full border border-black/10">
			<Timer className="w-4 h-4 text-purple-600" aria-hidden="true" />
			<span>
				{label}
				{formatTime(secondsLeft)}
			</span>
		</div>
	);
}
