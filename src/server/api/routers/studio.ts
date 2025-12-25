import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from '~/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
	incrementWin,
	getLeaderboard,
	getGameStats,
	hasWonToday,
	GAME_TYPES,
} from '~/server/api/helpers/game-stats';
import type { GameStatsWithUser } from '~/server/api/helpers/game-stats';

interface CharacterEntry {
	name?: string;
	role?: string;
}

/**
 * Anime with included genre relations for studio queries
 */
interface AnimeWithGenres {
	id: number;
	title: string;
	score: number | null;
	releasedYear: number | null;
	characters: unknown;
	animeGenres: Array<{ genre: { name: string } }>;
}

/**
 * Studio data returned from API
 */
interface StudioData {
	id: string;
	name: string;
	avgRating: number;
	firstAnimeYear: number;
	lastAnimeYear: number;
	topGenres: string[];
	characters: string[];
	animeList: string[];
}

/**
 * Leaderboard entry returned from API
 */
interface LeaderboardEntry {
	id: string;
	name: string | null;
	image: string | null;
	wins: number;
	totalTries: number;
}

/**
 * Gets midnight UTC for the current London calendar date.
 * This ensures consistent date values across all queries and mutations.
 */
function getLondonMidnightUTC(): Date {
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

export const studioRouter = createTRPCRouter({
	getAnswerStudio: publicProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated DailySchedule model
		const schedule = await ctx.db.dailySchedule.findUnique({
			where: {
				date_gameType: {
					date: today,
					gameType: GAME_TYPES.STUDIO,
				},
			},
			include: {
				studio: true,
			},
		});

		if (!schedule || !schedule.studio) {
			return {
				studio: null,
				hasWonToday: false,
				hasFailedToday: false,
			};
		}

		const targetStudio = schedule.studio;
		const targetStudioId = targetStudio.id;
		const targetStudioName = targetStudio.name;

		// Query animes using normalized junction table
		const studioAnimes: AnimeWithGenres[] = await ctx.db.anime.findMany({
			where: {
				animeStudios: {
					some: { studioId: targetStudioId },
				},
			},
			orderBy: { score: 'desc' },
			select: {
				id: true,
				title: true,
				score: true,
				releasedYear: true,
				characters: true,
				animeGenres: {
					select: { genre: { select: { name: true } } },
				},
			},
		});

		if (studioAnimes.length === 0) {
			return {
				studio: null,
				hasWonToday: false,
				hasFailedToday: false,
			};
		}

		const highRatedAnime = studioAnimes.filter(
			(a) => (a.score ?? 0) >= 7.5,
		);
		const recognizableSourcePool =
			highRatedAnime.length > 0 ? highRatedAnime : studioAnimes;

		// --- GENRE AGGREGATION ---
		// Use normalized data from animeGenres junction table
		const genreMap = studioAnimes.reduce(
			(acc, a) => {
				if (a.animeGenres && a.animeGenres.length > 0) {
					a.animeGenres.forEach((ag) => {
						const genre = ag.genre.name;
						if (genre) acc[genre] = (acc[genre] ?? 0) + 1;
					});
				}
				return acc;
			},
			{} as Record<string, number>,
		);

		const topGenres = Object.entries(genreMap)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5)
			.map(([name]) => name);

		const validScores = studioAnimes
			.map((a) => a.score)
			.filter((s): s is number => s !== null);
		const validYears = studioAnimes
			.map((a) => a.releasedYear)
			.filter((y): y is number => y !== null);

		// Characters Logic
		const characterList: string[] = [];
		for (const anime of recognizableSourcePool) {
			if (characterList.length >= 10) break;
			const characters = anime.characters as CharacterEntry[] | null;
			if (Array.isArray(characters) && characters.length > 0) {
				const charData = characters[0];
				if (charData?.name) {
					const cleanName = charData.name.includes(',')
						? charData.name.split(',').reverse().join(' ').trim()
						: charData.name;
					if (!characterList.includes(cleanName))
						characterList.push(cleanName);
				}
			}
		}

		for (let i = characterList.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[characterList[i], characterList[j]] = [
				characterList[j]!,
				characterList[i]!,
			];
		}

		const animeList = recognizableSourcePool
			.slice(0, 5)
			.map((a) => a.title);

		const studio: StudioData = {
			id: targetStudioId.toString(),
			name: targetStudioName,
			avgRating:
				validScores.length > 0
					? validScores.reduce((a, b) => a + b, 0) /
						validScores.length
					: 0,
			firstAnimeYear: validYears.length > 0 ? Math.min(...validYears) : 0,
			lastAnimeYear: validYears.length > 0 ? Math.max(...validYears) : 0,
			topGenres,
			characters: characterList,
			animeList,
		};

		let hasWonTodayFlag = false;
		let hasFailedTodayFlag = false;

		if (ctx.session?.user) {
			const stats = await getGameStats(
				ctx.db,
				ctx.session.user.id,
				GAME_TYPES.STUDIO,
			);
			hasWonTodayFlag = hasWonToday(stats);

			// Check session for failed status using consolidated GameSession model
			const session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: getLondonMidnightUTC(),
						gameType: GAME_TYPES.STUDIO,
					},
				},
			});
			hasFailedTodayFlag = session?.failed ?? false;
		}

		return {
			studio,
			hasWonToday: hasWonTodayFlag,
			hasFailedToday: hasFailedTodayFlag,
		};
	}),

	getAllStudios: publicProcedure.query(
		async ({ ctx }): Promise<{ id: string; name: string }[]> => {
			const studios = await ctx.db.studio.findMany({
				orderBy: { name: 'asc' },
				select: { id: true, name: true },
			});

			return studios.map((s) => ({
				id: s.id.toString(),
				name: s.name,
			}));
		},
	),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		const today = getLondonMidnightUTC();
		// Use consolidated GameSession model
		const session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.STUDIO,
				},
			},
		});

		if (!session) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Game session not found',
			});
		}

		return { success: true };
	}),

	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated GameSession model
		let session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.STUDIO,
				},
			},
			include: { guesses: true },
		});

		if (!session) {
			// Use consolidated DailySchedule model
			const dailySchedule = await ctx.db.dailySchedule.findUnique({
				where: {
					date_gameType: {
						date: today,
						gameType: GAME_TYPES.STUDIO,
					},
				},
				include: { studio: true },
			});

			if (!dailySchedule || !dailySchedule.studio) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No studio scheduled for today',
				});
			}

			// Create session using consolidated GameSession model
			// targetId stores the studio name for studio game
			session = await ctx.db.gameSession.create({
				data: {
					userId: ctx.session.user.id,
					gameType: GAME_TYPES.STUDIO,
					date: today,
					targetId: dailySchedule.studio.name,
				},
				include: { guesses: true },
			});
		}

		// Transform guesses to match expected format
		// guessData for studio contains { studioName: string }
		const transformedSession = {
			...session,
			studioId: session.targetId,
			guesses: session.guesses.map((guess) => {
				const guessData = guess.guessData as { studioName?: string };
				return {
					id: guess.id,
					sessionId: guess.sessionId,
					studioName: guessData?.studioName ?? '',
					createdAt: guess.createdAt,
				};
			}),
		};

		return transformedSession;
	}),

	addGameGuess: protectedProcedure
		.input(z.object({ studioName: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Use consolidated GameSession model
			let session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.STUDIO,
					},
				},
			});

			if (!session) {
				// Use consolidated DailySchedule model
				const dailySchedule = await ctx.db.dailySchedule.findUnique({
					where: {
						date_gameType: {
							date: today,
							gameType: GAME_TYPES.STUDIO,
						},
					},
					include: { studio: true },
				});

				if (!dailySchedule || !dailySchedule.studio) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'No studio scheduled for today',
					});
				}

				session = await ctx.db.gameSession.create({
					data: {
						userId: ctx.session.user.id,
						gameType: GAME_TYPES.STUDIO,
						date: today,
						targetId: dailySchedule.studio.name,
					},
				});
			}

			// Use consolidated GameGuess model with guessData containing studioName
			const guess = await ctx.db.gameGuess.create({
				data: {
					sessionId: session.id,
					guessData: { studioName: input.studioName },
				},
			});

			// Return in expected format
			return {
				id: guess.id,
				sessionId: guess.sessionId,
				studioName: input.studioName,
				createdAt: guess.createdAt,
			};
		}),

	submitWin: protectedProcedure
		.input(z.object({ tries: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Use consolidated GameSession model
			await ctx.db.gameSession.update({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.STUDIO,
					},
				},
				data: { won: true },
			});

			await incrementWin(
				ctx.db,
				ctx.session.user.id,
				GAME_TYPES.STUDIO,
				input.tries,
			);

			return { success: true };
		}),

	submitLoss: protectedProcedure.mutation(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated GameSession model
		return ctx.db.gameSession.update({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.STUDIO,
				},
			},
			data: { failed: true },
		});
	}),

	getLeaderboard: publicProcedure.query(
		async ({ ctx }): Promise<LeaderboardEntry[]> => {
			const leaderboard = await getLeaderboard(
				ctx.db,
				GAME_TYPES.STUDIO,
				10,
			);
			return leaderboard.map((stat: GameStatsWithUser) => ({
				id: stat.user.id,
				name: stat.user.name,
				image: stat.user.image,
				wins: stat.wins,
				totalTries: stat.totalTries,
			}));
		},
	),

	checkDateScheduled: adminProcedure
		.input(z.object({ date: z.date() }))
		.query(async ({ ctx, input }) => {
			const targetDate = new Date(
				Date.UTC(
					input.date.getUTCFullYear(),
					input.date.getUTCMonth(),
					input.date.getUTCDate(),
					0,
					0,
					0,
					0,
				),
			);

			// Use consolidated DailySchedule model
			const schedule = await ctx.db.dailySchedule.findUnique({
				where: {
					date_gameType: {
						date: targetDate,
						gameType: GAME_TYPES.STUDIO,
					},
				},
			});

			return { hasSchedule: !!schedule };
		}),

	scheduleDaily: adminProcedure
		.input(z.object({ studioName: z.string(), date: z.date() }))
		.mutation(async ({ ctx, input }) => {
			const targetDate = new Date(
				Date.UTC(
					input.date.getUTCFullYear(),
					input.date.getUTCMonth(),
					input.date.getUTCDate(),
					0,
					0,
					0,
					0,
				),
			);

			// Find or create the studio
			let studio = await ctx.db.studio.findUnique({
				where: { name: input.studioName },
			});

			studio ??= await ctx.db.studio.create({
				data: { name: input.studioName },
			});

			// Use consolidated DailySchedule model
			return ctx.db.dailySchedule.upsert({
				where: {
					date_gameType: {
						date: targetDate,
						gameType: GAME_TYPES.STUDIO,
					},
				},
				update: { studioId: studio.id },
				create: {
					date: targetDate,
					gameType: GAME_TYPES.STUDIO,
					studioId: studio.id,
				},
			});
		}),
});
