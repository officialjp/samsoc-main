/**
 * Prisma Accelerate cache configuration
 * TTL-only strategy (free tier compatible - no invalidation API)
 *
 * Usage:
 * ```typescript
 * import { CACHE_STRATEGIES } from '~/server/api/helpers/cache';
 *
 * const result = await db.model.findMany({
 *   where: { ... },
 *   cacheStrategy: CACHE_STRATEGIES.MODERATE,
 * });
 * ```
 */

// TTL in seconds
export const CACHE_TTL = {
	// Static content - rarely changes (committee, carousel)
	STATIC: 3600, // 1 hour

	// Semi-static content (carousel)
	CAROUSEL: 1800, // 30 minutes

	// Moderate update frequency (events, manga, images)
	MODERATE: 600, // 10 minutes

	// Dynamic content - frequent updates (leaderboards)
	DYNAMIC: 30, // 30 seconds

	// Daily game content
	DAILY: 300, // 5 minutes

	// Static reference data (studio list, anime by ID)
	REFERENCE: 3600, // 1 hour
} as const;

// Stale-while-revalidate multiplier
export const SWR_MULTIPLIER = 2;

// Helper to create cache strategy object
export function createCacheStrategy(ttl: number) {
	return {
		ttl,
		swr: ttl * SWR_MULTIPLIER,
	} as const;
}

// Pre-configured cache strategies for common use cases
export const CACHE_STRATEGIES = {
	/** 1 hour cache - for rarely changing content like committee members */
	STATIC: createCacheStrategy(CACHE_TTL.STATIC),

	/** 30 min cache - for carousel/hero content */
	CAROUSEL: createCacheStrategy(CACHE_TTL.CAROUSEL),

	/** 10 min cache - for moderately updated content like events, manga, images */
	MODERATE: createCacheStrategy(CACHE_TTL.MODERATE),

	/** 30 sec cache - for frequently updated content like leaderboards */
	DYNAMIC: createCacheStrategy(CACHE_TTL.DYNAMIC),

	/** 5 min cache - for daily game answers (changes once per day) */
	DAILY: createCacheStrategy(CACHE_TTL.DAILY),

	/** 1 hour cache - for static reference data like studio list, anime details */
	REFERENCE: createCacheStrategy(CACHE_TTL.REFERENCE),
} as const;
