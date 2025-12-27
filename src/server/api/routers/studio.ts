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

interface CharacterEntry {
	name?: string;
	role?: string;
}

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

interface LeaderboardEntry {
	id: string;
	name: string | null;
	image: string | null;
	wins: number;
	totalTries: number;
}

/**
 * Gets midnight UTC for the current London calendar date.
 * Consistent across queries and mutations.
 */
function getLondonMidnightUTC(inputDate?: Date): Date {
	const now = inputDate ?? new Date();
	const formatter = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/London',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	const londonDateStr = formatter.format(now);
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

		const studioAnimes = await ctx.db.anime.findMany({
			where: {
				animeStudios: {
					some: { studioId: targetStudio.id },
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

		const genreMap = studioAnimes.reduce(
			(acc, a) => {
				a.animeGenres.forEach((ag) => {
					const genre = ag.genre.name;
					acc[genre] = (acc[genre] ?? 0) + 1;
				});
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

		const characterList: string[] = [];
		for (const anime of recognizableSourcePool) {
			if (characterList.length >= 10) break;
			const characters = anime.characters as unknown as
				| CharacterEntry[]
				| null;
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

		const studio: StudioData = {
			id: targetStudio.id.toString(),
			name: targetStudio.name,
			avgRating:
				validScores.length > 0
					? validScores.reduce((a, b) => a + b, 0) /
						validScores.length
					: 0,
			firstAnimeYear: validYears.length > 0 ? Math.min(...validYears) : 0,
			lastAnimeYear: validYears.length > 0 ? Math.max(...validYears) : 0,
			topGenres,
			characters: characterList.sort(() => Math.random() - 0.5),
			animeList: recognizableSourcePool.slice(0, 5).map((a) => a.title),
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

			const session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
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

	getAllStudios: publicProcedure.query(async ({ ctx }) => {
		const studios = await ctx.db.studio.findMany({
			orderBy: { name: 'asc' },
			select: { id: true, name: true },
		});

		return studios.map((s) => ({
			id: s.id.toString(),
			name: s.name,
		}));
	}),

	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

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
				include: { guesses: true },
			});
		}

		return {
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
	}),

	addGameGuess: protectedProcedure
		.input(z.object({ studioName: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

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
					code: 'PRECONDITION_FAILED',
					message: 'Session not found',
				});
			}

			const guess = await ctx.db.gameGuess.create({
				data: {
					sessionId: session.id,
					guessData: { studioName: input.studioName },
				},
			});

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
			return leaderboard.map((stat) => ({
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
			const targetDate = getLondonMidnightUTC(input.date);

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
		.input(z.object({ studioId: z.number(), date: z.date() }))
		.mutation(async ({ ctx, input }) => {
			const targetDate = getLondonMidnightUTC(input.date);

			return ctx.db.dailySchedule.upsert({
				where: {
					date_gameType: {
						date: targetDate,
						gameType: GAME_TYPES.STUDIO,
					},
				},
				update: { studioId: input.studioId },
				create: {
					date: targetDate,
					gameType: GAME_TYPES.STUDIO,
					studioId: input.studioId,
				},
			});
		}),
});
