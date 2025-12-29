import posthog from 'posthog-js';

// Only initialize if we have the API key
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
	try {
		posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
			api_host: '/ingest',
			ui_host: 'https://eu.posthog.com',
			autocapture: false, // Manual capture only
			capture_exceptions: true,
			persistence: 'localStorage+cookie',
			cross_subdomain_cookie: false,
			secure_cookie: true,
			disable_session_recording: true, // Disable if not using session replay
			debug: process.env.NODE_ENV === 'development',
			loaded: (ph) => {
				// Mark as initialized
				if (typeof window !== 'undefined') {
					(window as Window & { __posthogInitError?: Error | null })['__posthogInitError'] = null;
				}
				if (process.env.NODE_ENV === 'development') {
					console.log('[PostHog] Initialized successfully');
				}
			},
		});
	} catch (error) {
		const initError = error instanceof Error ? error : new Error(String(error));
		if (process.env.NODE_ENV === 'development') {
			console.error('[PostHog] Initialization failed:', error);
		}
		if (typeof window !== 'undefined') {
			(window as Window & { __posthogInitError?: Error | null })['__posthogInitError'] = initError;
		}
	}
} else if (process.env.NODE_ENV === 'development') {
	console.warn('[PostHog] Skipping initialization - NEXT_PUBLIC_POSTHOG_KEY not found');
}
