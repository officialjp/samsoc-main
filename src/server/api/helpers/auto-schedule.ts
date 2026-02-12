/**
 * Auto-scheduling helper functions
 * Provides utilities for automatically generating daily game schedules
 */

import { GAME_TYPES, type GameType } from './game-stats';

// Type for the database client (using any to avoid Prisma type complexity)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbContext = any;

/**
 * Fallback windows for exclusion days when no eligible items found
 * Tries 7 days first, then progressively smaller windows
 */
const FALLBACK_WINDOWS = [7, 5, 3, 1, 0] as const;

/**
 * Maximum popularity rank to be considered "popular enough" for games
 */
const MAX_POPULARITY_RANK = 800;

/**
 * Minimum number of popular animes a studio must have for daily selection
 * Falls back to lower thresholds if no studios meet the requirement
 */
const MIN_STUDIO_ANIME_COUNT_WINDOWS = [15, 12, 10, 8, 5, 3, 1] as const;

/**
 * Result of a schedule generation attempt
 */
export interface ScheduleResult {
	created: boolean;
	animeId?: number;
	studioId?: number;
	title?: string;
	name?: string;
	reason?: string;
	fallbackUsed?: boolean;
	fallbackDays?: number;
}

/**
 * Result of generating all schedules
 */
export interface GenerationResults {
	date: string;
	results: {
		wordle: ScheduleResult;
		studio: ScheduleResult;
		banner: ScheduleResult;
	};
}

/**
 * Gets midnight UTC for the current London calendar date.
 * This ensures consistent date values across all queries and mutations.
 */
export function getLondonMidnightUTC(): Date {
	const now = new Date();
	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/London',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	const londonDateStr = formatter.format(now); // "2025-12-20"
	const [year, month, day] = londonDateStr.split('-').map(Number) as [
		number,
		number,
		number,
	];
	return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Parse popularity string to number
 * Handles formats like "#15000" or "15000"
 */
export function parsePopularity(popularity: string | null): number | null {
	if (!popularity) return null;
	const match = /^#?(\d+)$/.exec(popularity);
	return match?.[1] ? parseInt(match[1], 10) : null;
}

/**
 * Check if an anime is within the popularity threshold
 */
export function isPopularEnough(popularity: string | null): boolean {
	const rank = parsePopularity(popularity);
	return rank !== null && rank <= MAX_POPULARITY_RANK;
}

/**
 * Get anime IDs used in the last N days for a specific game type
 */
export async function getRecentlyUsedAnimeIds(
	db: DbContext,
	gameType: GameType,
	days: number,
): Promise<number[]> {
	if (days <= 0) return [];

	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const recentSchedules = await db.dailySchedule.findMany({
		where: {
			gameType,
			date: { gte: cutoffDate },
			animeId: { not: null },
		},
		select: { animeId: true },
	});

	return (recentSchedules as Array<{ animeId: number | null }>)
		.map((s) => s.animeId)
		.filter((id): id is number => id !== null);
}

/**
 * Get studio IDs used in the last N days
 */
export async function getRecentlyUsedStudioIds(
	db: DbContext,
	days: number,
): Promise<number[]> {
	if (days <= 0) return [];

	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const recentSchedules = await db.dailySchedule.findMany({
		where: {
			gameType: GAME_TYPES.STUDIO,
			date: { gte: cutoffDate },
			studioId: { not: null },
		},
		select: { studioId: true },
	});

	return (recentSchedules as Array<{ studioId: number | null }>)
		.map((s) => s.studioId)
		.filter((id): id is number => id !== null);
}

/**
 * Anime data structure for selection
 */
interface AnimeCandidate {
	id: number;
	title: string;
	popularity: string | null;
	image?: string | null;
}

/**
 * Studio data structure for selection
 */
interface StudioCandidate {
	id: number;
	name: string;
	animes: Array<{ anime: { popularity: string | null } }>;
}

/**
 * Randomly select an item from an array
 */
function randomPick<T>(items: T[]): T | null {
	if (items.length === 0) return null;
	return items[Math.floor(Math.random() * items.length)] ?? null;
}

/**
 * Select a random anime for the Wordle game
 * Criteria: popularity <= 1500, not used in last N days (with fallback)
 */
export async function selectWordleAnime(db: DbContext): Promise<{
	anime: { id: number; title: string } | null;
	fallbackDays: number | null;
}> {
	for (const days of FALLBACK_WINDOWS) {
		const recentIds = await getRecentlyUsedAnimeIds(
			db,
			GAME_TYPES.WORDLE,
			days,
		);

		// Fetch all anime and filter by popularity in memory
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const allAnime = await db.anime.findMany({
			where: {
				...(recentIds.length > 0 ? { id: { notIn: recentIds } } : {}),
			},
			select: {
				id: true,
				title: true,
				popularity: true,
			},
		});

		const eligible: AnimeCandidate[] = (
			allAnime as AnimeCandidate[]
		).filter((a: AnimeCandidate) => isPopularEnough(a.popularity));

		if (eligible.length > 0) {
			const selected = randomPick(eligible);
			return {
				anime: selected
					? { id: selected.id, title: selected.title }
					: null,
				fallbackDays: days < 7 ? days : null,
			};
		}
	}

	return { anime: null, fallbackDays: null };
}

/**
 * Select a random anime for the Banner game
 * Criteria: popularity <= 1500, has valid image, not used in last N days (with fallback)
 */
export async function selectBannerAnime(db: DbContext): Promise<{
	anime: { id: number; title: string } | null;
	fallbackDays: number | null;
}> {
	for (const days of FALLBACK_WINDOWS) {
		const recentIds = await getRecentlyUsedAnimeIds(
			db,
			GAME_TYPES.BANNER,
			days,
		);

		// Fetch anime with images and filter by popularity in memory
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const allAnime = await db.anime.findMany({
			where: {
				...(recentIds.length > 0 ? { id: { notIn: recentIds } } : {}),
				image: { not: null },
			},
			select: {
				id: true,
				title: true,
				popularity: true,
				image: true,
			},
		});

		const eligible: AnimeCandidate[] = (
			allAnime as AnimeCandidate[]
		).filter(
			(a: AnimeCandidate) =>
				isPopularEnough(a.popularity) &&
				a.image &&
				a.image.trim() !== '',
		);

		if (eligible.length > 0) {
			const selected = randomPick(eligible);
			return {
				anime: selected
					? { id: selected.id, title: selected.title }
					: null,
				fallbackDays: days < 7 ? days : null,
			};
		}
	}

	return { anime: null, fallbackDays: null };
}

/**
 * Select a random studio for the StudioGuessr game
 * Criteria: has at least 15 popular animes (popularity <= 800), not used in last N days
 * Falls back to lower anime count thresholds (12, 10, 8, 5, 3, 1) if no studios meet the requirement
 * Also falls back on the days window if needed (prioritizes days first, then anime count)
 */
export async function selectStudio(db: DbContext): Promise<{
	studio: { id: number; name: string } | null;
	fallbackDays: number | null;
}> {
	for (const days of FALLBACK_WINDOWS) {
		const recentIds = await getRecentlyUsedStudioIds(db, days);

		// Fetch all studios with their anime
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const allStudios = await db.studio.findMany({
			where: {
				...(recentIds.length > 0 ? { id: { notIn: recentIds } } : {}),
			},
			select: {
				id: true,
				name: true,
				animes: {
					select: {
						anime: {
							select: {
								popularity: true,
							},
						},
					},
				},
			},
		});

		// Try each minimum anime count threshold (prioritize higher counts first)
		for (const minCount of MIN_STUDIO_ANIME_COUNT_WINDOWS) {
			// Filter to studios that have at least minCount popular animes
			const eligible: StudioCandidate[] = (
				allStudios as StudioCandidate[]
			).filter((studio: StudioCandidate) => {
				const popularAnimeCount = studio.animes.filter((as) =>
					isPopularEnough(as.anime.popularity),
				).length;
				return popularAnimeCount >= minCount;
			});

			if (eligible.length > 0) {
				const selected = randomPick(eligible);
				return {
					studio: selected
						? { id: selected.id, name: selected.name }
						: null,
					fallbackDays: days < 7 ? days : null,
				};
			}
		}
	}

	return { studio: null, fallbackDays: null };
}

/**
 * Check if a schedule already exists for a given date and game type
 */
export async function scheduleExists(
	db: DbContext,
	date: Date,
	gameType: GameType,
): Promise<boolean> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const existing = await db.dailySchedule.findUnique({
		where: {
			date_gameType: {
				date,
				gameType,
			},
		},
	});
	return existing !== null;
}

/**
 * Create a schedule for a given date and game type
 */
export async function createSchedule(
	db: DbContext,
	date: Date,
	gameType: GameType,
	animeId?: number,
	studioId?: number,
): Promise<void> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	await db.dailySchedule.upsert({
		where: {
			date_gameType: {
				date,
				gameType,
			},
		},
		update: {
			...(animeId !== undefined ? { animeId } : {}),
			...(studioId !== undefined ? { studioId } : {}),
		},
		create: {
			date,
			gameType,
			...(animeId !== undefined ? { animeId } : {}),
			...(studioId !== undefined ? { studioId } : {}),
		},
	});
}

/**
 * Generate all missing schedules for today
 * Main orchestration function called by the cron endpoint
 */
export async function generateMissingSchedules(
	db: DbContext,
): Promise<GenerationResults> {
	const today = getLondonMidnightUTC();
	const dateStr = today.toISOString().split('T')[0]!;

	const results: GenerationResults = {
		date: dateStr,
		results: {
			wordle: { created: false },
			studio: { created: false },
			banner: { created: false },
		},
	};

	// Generate all three game schedules in parallel
	const [wordleResult, studioResult, bannerResult] = await Promise.all([
		// --- WORDLE ---
		(async (): Promise<ScheduleResult> => {
			if (await scheduleExists(db, today, GAME_TYPES.WORDLE)) {
				return { created: false, reason: 'already_scheduled' };
			}
			const { anime, fallbackDays } = await selectWordleAnime(db);
			if (anime) {
				await createSchedule(db, today, GAME_TYPES.WORDLE, anime.id);
				return {
					created: true,
					animeId: anime.id,
					title: anime.title,
					fallbackUsed: fallbackDays !== null,
					...(fallbackDays !== null ? { fallbackDays } : {}),
				};
			}
			return { created: false, reason: 'no_eligible_anime' };
		})(),

		// --- STUDIO ---
		(async (): Promise<ScheduleResult> => {
			if (await scheduleExists(db, today, GAME_TYPES.STUDIO)) {
				return { created: false, reason: 'already_scheduled' };
			}
			const { studio, fallbackDays } = await selectStudio(db);
			if (studio) {
				await createSchedule(
					db,
					today,
					GAME_TYPES.STUDIO,
					undefined,
					studio.id,
				);
				return {
					created: true,
					studioId: studio.id,
					name: studio.name,
					fallbackUsed: fallbackDays !== null,
					...(fallbackDays !== null ? { fallbackDays } : {}),
				};
			}
			return { created: false, reason: 'no_eligible_studio' };
		})(),

		// --- BANNER ---
		(async (): Promise<ScheduleResult> => {
			if (await scheduleExists(db, today, GAME_TYPES.BANNER)) {
				return { created: false, reason: 'already_scheduled' };
			}
			const { anime, fallbackDays } = await selectBannerAnime(db);
			if (anime) {
				await createSchedule(db, today, GAME_TYPES.BANNER, anime.id);
				return {
					created: true,
					animeId: anime.id,
					title: anime.title,
					fallbackUsed: fallbackDays !== null,
					...(fallbackDays !== null ? { fallbackDays } : {}),
				};
			}
			return { created: false, reason: 'no_eligible_anime' };
		})(),
	]);

	results.results.wordle = wordleResult;
	results.results.studio = studioResult;
	results.results.banner = bannerResult;

	return results;
}
