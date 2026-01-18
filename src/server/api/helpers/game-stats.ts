/**
 * Game statistics helper functions
 * Provides utilities for managing user game stats across all game types
 */

import { CACHE_STRATEGIES } from '~/server/api/helpers/cache';

/**
 * Supported game types
 */
export const GAME_TYPES = {
	WORDLE: 'wordle',
	STUDIO: 'studio',
	BANNER: 'banner',
} as const;

export type GameType = (typeof GAME_TYPES)[keyof typeof GAME_TYPES];

/**
 * Game stats record shape
 */
export interface GameStatsRecord {
	id: string;
	userId: string;
	gameType: string;
	wins: number;
	lastWonAt: Date | null;
	totalTries: number;
	dailyGuesses: number;
	lastGuessAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * User shape for leaderboard
 */
export interface LeaderboardUser {
	id: string;
	name: string | null;
	image: string | null;
}

/**
 * Game stats with user relation for leaderboard queries
 */
export interface GameStatsWithUser extends GameStatsRecord {
	user: LeaderboardUser;
}

// The db context type uses any because Prisma's extended client types
// are not easily inferred. The return types are properly typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbContext = any;

/**
 * Get game statistics for a specific user and game type
 */
export async function getGameStats(
	db: DbContext,
	userId: string,
	gameType: GameType,
): Promise<GameStatsRecord | null> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.gameStats.findUnique({
		where: {
			userId_gameType: {
				userId,
				gameType,
			},
		},
	});
}

/**
 * Get all game statistics for a user across all game types
 */
export async function getAllUserGameStats(
	db: DbContext,
	userId: string,
): Promise<GameStatsRecord[]> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.gameStats.findMany({
		where: { userId },
		orderBy: { gameType: 'asc' },
	});
}

/**
 * Increment win count and update related stats
 */
export async function incrementWin(
	db: DbContext,
	userId: string,
	gameType: GameType,
	tries: number,
): Promise<GameStatsRecord> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.gameStats.upsert({
		where: {
			userId_gameType: {
				userId,
				gameType,
			},
		},
		create: {
			userId,
			gameType,
			wins: 1,
			lastWonAt: new Date(),
			totalTries: tries,
			dailyGuesses: tries,
			lastGuessAt: new Date(),
		},
		update: {
			wins: { increment: 1 },
			lastWonAt: new Date(),
			totalTries: { increment: tries },
			dailyGuesses: tries,
			lastGuessAt: new Date(),
		},
	});
}

/**
 * Increment total tries without recording a win
 */
export async function incrementTries(
	db: DbContext,
	userId: string,
	gameType: GameType,
	tries: number,
): Promise<GameStatsRecord> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.gameStats.upsert({
		where: {
			userId_gameType: {
				userId,
				gameType,
			},
		},
		create: {
			userId,
			gameType,
			totalTries: tries,
			dailyGuesses: tries,
			lastGuessAt: new Date(),
		},
		update: {
			totalTries: { increment: tries },
			dailyGuesses: tries,
			lastGuessAt: new Date(),
		},
	});
}

/**
 * Update daily guesses count
 */
export async function updateDailyGuesses(
	db: DbContext,
	userId: string,
	gameType: GameType,
	guesses: number,
): Promise<GameStatsRecord> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.gameStats.upsert({
		where: {
			userId_gameType: {
				userId,
				gameType,
			},
		},
		create: {
			userId,
			gameType,
			dailyGuesses: guesses,
			lastGuessAt: new Date(),
		},
		update: {
			dailyGuesses: guesses,
			lastGuessAt: new Date(),
		},
	});
}

/**
 * Get leaderboard for a specific game type
 */
export async function getLeaderboard(
	db: DbContext,
	gameType: GameType,
	limit = 10,
): Promise<GameStatsWithUser[]> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const results = await db.gameStats.findMany({
		where: {
			gameType,
			wins: { gt: 0 },
		},
		orderBy: [{ wins: 'desc' }, { totalTries: 'asc' }],
		take: limit,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
		cacheStrategy: CACHE_STRATEGIES.DYNAMIC,
	});

	return results as GameStatsWithUser[];
}

/**
 * Check if user has played today (based on lastGuessAt)
 * Uses London timezone for consistency with the rest of the app
 */
export function hasPlayedToday(
	stats: Pick<GameStatsRecord, 'lastGuessAt'> | null,
): boolean {
	if (!stats?.lastGuessAt) return false;

	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/London',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	const todayStr = formatter.format(new Date());
	const lastGuessStr = formatter.format(new Date(stats.lastGuessAt));

	return todayStr === lastGuessStr;
}

/**
 * Check if user has won today (based on lastWonAt)
 * Uses London timezone for consistency with the rest of the app
 */
export function hasWonToday(
	stats: Pick<GameStatsRecord, 'lastWonAt'> | null,
): boolean {
	if (!stats?.lastWonAt) return false;

	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/London',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});

	const todayStr = formatter.format(new Date());
	const lastWonStr = formatter.format(new Date(stats.lastWonAt));

	return todayStr === lastWonStr;
}

/**
 * Initialize game stats for a new user (creates records for all game types)
 */
export async function initializeGameStats(
	db: DbContext,
	userId: string,
): Promise<GameStatsRecord[]> {
	const gameTypes = Object.values(GAME_TYPES);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	return db.$transaction(
		gameTypes.map((gameType: GameType) =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			db.gameStats.upsert({
				where: {
					userId_gameType: {
						userId,
						gameType,
					},
				},
				create: {
					userId,
					gameType,
				},
				update: {},
			}),
		),
	);
}

/**
 * Get user's rank for a specific game type
 */
export async function getUserRank(
	db: DbContext,
	userId: string,
	gameType: GameType,
): Promise<number | null> {
	const userStats = await getGameStats(db, userId, gameType);
	if (!userStats || userStats.wins === 0) return null;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const betterPlayers: number = await db.gameStats.count({
		where: {
			gameType,
			OR: [
				{ wins: { gt: userStats.wins } },
				{
					wins: userStats.wins,
					totalTries: { lt: userStats.totalTries },
				},
			],
		},
	});

	return betterPlayers + 1;
}
