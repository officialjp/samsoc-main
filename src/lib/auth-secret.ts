/**
 * Shared utility for consistent AUTH_SECRET handling across the application.
 * Ensures both auth config and proxy use the same secret for signing and verifying JWT tokens.
 */

export function getAuthSecret(): string | undefined {
	let secret = process.env.AUTH_SECRET;

	if (!secret && process.env.NODE_ENV === 'development') {
		console.warn(
			'⚠️  AUTH_SECRET not set. Using development fallback. DO NOT use in production!',
		);
		secret = 'development-secret-key-change-in-production';
	}

	return secret;
}
