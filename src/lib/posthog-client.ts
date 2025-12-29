'use client';

import posthog from 'posthog-js';

/**
 * Check if PostHog is initialized and ready to use
 */
export function isPostHogReady(): boolean {
	if (typeof window === 'undefined') return false;

	// Check if there was an initialization error
	const initError = (window as Window & { __posthogInitError?: Error | null })['__posthogInitError'];
	if (initError) return false;

	// PostHog is ready if it has the capture method
	// The imported posthog instance is the same one used in instrumentation-client.ts
	return typeof posthog.capture === 'function';
}

/**
 * Safely capture an event with PostHog
 * Returns true if the event was captured, false otherwise
 */
export function captureEvent(
	eventName: string,
	properties?: Record<string, unknown>,
): boolean {
	if (typeof window === 'undefined') {
		if (process.env.NODE_ENV === 'development') {
			console.warn(`[PostHog] Cannot capture "${eventName}" - window is undefined`);
		}
		return false;
	}

	if (!isPostHogReady()) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`[PostHog] Cannot capture "${eventName}" - PostHog not initialized yet`,
			);
		}
		// Queue the event for later if PostHog initializes
		queueEvent(eventName, properties);
		return false;
	}

	try {
		posthog.capture(eventName, properties);
		if (process.env.NODE_ENV === 'development') {
			console.log(`[PostHog] Captured event: "${eventName}"`, properties);
		}
		return true;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(`[PostHog] Error capturing "${eventName}":`, error);
		}
	}

	return false;
}

/**
 * Safely identify a user with PostHog
 */
export function identifyUser(
	userId: string,
	properties?: Record<string, unknown>,
): boolean {
	if (typeof window === 'undefined') return false;

	if (!isPostHogReady()) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`[PostHog] Cannot identify user "${userId}" - PostHog not initialized yet`,
			);
		}
		return false;
	}

	try {
		posthog.identify(userId, properties);
		if (process.env.NODE_ENV === 'development') {
			console.log(`[PostHog] Identified user: "${userId}"`, properties);
		}
		return true;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(`[PostHog] Error identifying user "${userId}":`, error);
		}
	}

	return false;
}

/**
 * Safely reset PostHog (e.g., on logout)
 */
export function resetPostHog(): boolean {
	if (typeof window === 'undefined') return false;

	if (!isPostHogReady()) {
		return false;
	}

	try {
		posthog.reset();
		if (process.env.NODE_ENV === 'development') {
			console.log('[PostHog] Reset');
		}
		return true;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('[PostHog] Error resetting:', error);
		}
	}

	return false;
}

/**
 * Safely capture an exception with PostHog
 */
export function captureException(error: Error): boolean {
	if (typeof window === 'undefined') return false;

	if (!isPostHogReady()) {
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				`[PostHog] Cannot capture exception - PostHog not initialized yet`,
			);
		}
		return false;
	}

	try {
		if (typeof posthog.captureException === 'function') {
			posthog.captureException(error);
			if (process.env.NODE_ENV === 'development') {
				console.log('[PostHog] Captured exception:', error);
			}
			return true;
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('[PostHog] Error capturing exception:', err);
		}
	}

	return false;
}

/**
 * Event queue for events captured before PostHog is ready
 */
const eventQueue: Array<{ eventName: string; properties?: Record<string, unknown> }> = [];

function queueEvent(eventName: string, properties?: Record<string, unknown>) {
	eventQueue.push({ eventName, properties });

	// Try to flush queue after a short delay
	setTimeout(() => {
		flushEventQueue();
	}, 1000);
}

function flushEventQueue() {
	if (!isPostHogReady()) return;

	while (eventQueue.length > 0) {
		const event = eventQueue.shift();
		if (event) {
			captureEvent(event.eventName, event.properties);
		}
	}
}

// Try to flush queue when PostHog becomes ready
if (typeof window !== 'undefined') {
	// Check periodically if PostHog is ready and flush queue
	const checkInterval = setInterval(() => {
		if (isPostHogReady() && eventQueue.length > 0) {
			flushEventQueue();
			clearInterval(checkInterval);
		}
	}, 500);

	// Clear interval after 10 seconds to avoid infinite checking
	setTimeout(() => {
		clearInterval(checkInterval);
	}, 10000);
}

/**
 * Get the PostHog instance directly (use with caution)
 * Only use this if you need direct access to PostHog methods not covered by utilities
 */
export function getPostHogInstance(): typeof posthog | null {
	if (typeof window === 'undefined' || !isPostHogReady()) {
		return null;
	}

	return posthog;
}
