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
	GAME_TYPES,
} from '~/server/api/helpers/game-stats';
import type { GameStatsWithUser } from '~/server/api/helpers/game-stats';
import type { Prisma } from 'generated/prisma/client';
import { CACHE_STRATEGIES } from '~/server/api/helpers/cache';

/**
 * Return type for anime data used in wordle game
 */
interface AnimeWordleData {
	id: number;
	title: string;
	releasedYear: number | null;
	releasedSeason: string | null;
	genres: string | null;
	themes: string | null;
	studios: string | null;
	source: string | null;
	score: number | null;
	// Hint-related fields
	description: string | null;
	characters: unknown;
	image: string | null;
}

/**
 * Return type for leaderboard entries
 */
interface LeaderboardEntry {
	id: string;
	name: string | null;
	image: string | null;
	wins: number;
	totalTries: number;
}

/**
 * Helper to convert normalized genre relations to comma-separated string
 */
function normalizedGenresToString(
	animeGenres: Array<{ genre: { name: string } }> | undefined | null,
): string | null {
	if (animeGenres && animeGenres.length > 0) {
		return animeGenres.map((ag) => ag.genre.name).join(', ');
	}
	return null;
}

/**
 * Helper to convert normalized theme relations to comma-separated string
 */
function normalizedThemesToString(
	animeThemes: Array<{ theme: { name: string } }> | undefined | null,
): string | null {
	if (animeThemes && animeThemes.length > 0) {
		return animeThemes.map((at) => at.theme.name).join(', ');
	}
	return null;
}

/**
 * Helper to convert normalized studio relations to comma-separated string
 */
function normalizedStudiosToString(
	animeStudios: Array<{ studio: { name: string } }> | undefined | null,
): string | null {
	if (animeStudios && animeStudios.length > 0) {
		return animeStudios.map((as) => as.studio.name).join(', ');
	}
	return null;
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

export const animeRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ id: z.number().int() }))
		.query(async ({ ctx, input }) => {
			const anime = await ctx.db.anime.findUnique({
				where: { id: input.id },
				select: {
					id: true,
					title: true,
					releasedYear: true,
					releasedSeason: true,
					source: true,
					score: true,
					animeGenres: {
						select: { genre: { select: { name: true } } },
					},
					animeThemes: {
						select: { theme: { select: { name: true } } },
					},
					animeStudios: {
						select: { studio: { select: { name: true } } },
					},
				},
				cacheStrategy: CACHE_STRATEGIES.REFERENCE,
			});

			if (!anime) return null;

			return {
				id: anime.id,
				title: anime.title,
				releasedYear: anime.releasedYear,
				releasedSeason: anime.releasedSeason,
				genres: normalizedGenresToString(anime.animeGenres),
				themes: normalizedThemesToString(anime.animeThemes),
				studios: normalizedStudiosToString(anime.animeStudios),
				source: anime.source,
				score: anime.score,
			};
		}),

	// Wordle Game Routes
	getAnswerAnime: publicProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated DailySchedule model
		const schedule = await ctx.db.dailySchedule.findUnique({
			where: {
				date_gameType: {
					date: today,
					gameType: GAME_TYPES.WORDLE,
				},
			},
			include: {
				anime: {
					select: {
						id: true,
						title: true,
						releasedYear: true,
						releasedSeason: true,
						source: true,
						score: true,
						description: true,
						characters: true,
						image: true,
						animeGenres: {
							select: { genre: { select: { name: true } } },
						},
						animeThemes: {
							select: { theme: { select: { name: true } } },
						},
						animeStudios: {
							select: { studio: { select: { name: true } } },
						},
					},
				},
			},
			cacheStrategy: CACHE_STRATEGIES.DAILY,
		});

		let anime: AnimeWordleData | null = null;

		if (schedule?.anime) {
			const a = schedule.anime;
			anime = {
				id: a.id,
				title: a.title,
				releasedYear: a.releasedYear,
				releasedSeason: a.releasedSeason,
				genres: normalizedGenresToString(a.animeGenres),
				themes: normalizedThemesToString(a.animeThemes),
				studios: normalizedStudiosToString(a.animeStudios),
				source: a.source,
				score: a.score,
				description: a.description,
				characters: a.characters,
				image: a.image,
			};
		} else {
			// Fallback to anime with ID 1 for development
			const fallback = await ctx.db.anime.findUnique({
				where: { id: 1 },
				select: {
					id: true,
					title: true,
					releasedYear: true,
					releasedSeason: true,
					source: true,
					score: true,
					description: true,
					characters: true,
					image: true,
					animeGenres: {
						select: { genre: { select: { name: true } } },
					},
					animeThemes: {
						select: { theme: { select: { name: true } } },
					},
					animeStudios: {
						select: { studio: { select: { name: true } } },
					},
				},
			});

			if (fallback) {
				anime = {
					id: fallback.id,
					title: fallback.title,
					releasedYear: fallback.releasedYear,
					releasedSeason: fallback.releasedSeason,
					genres: normalizedGenresToString(fallback.animeGenres),
					themes: normalizedThemesToString(fallback.animeThemes),
					studios: normalizedStudiosToString(fallback.animeStudios),
					source: fallback.source,
					score: fallback.score,
					description: fallback.description,
					characters: fallback.characters,
					image: fallback.image,
				};
			}
		}

		if (!anime) {
			return {
				anime: null,
				hasWonToday: false,
				hasFailedToday: false,
			};
		}

		let hasWonToday = false;
		let hasFailedToday = false;

		if (ctx.session?.user) {
			// Use consolidated GameSession model
			const session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.WORDLE,
					},
				},
			});

			if (session) {
				hasWonToday = session.won;
				hasFailedToday = session.failed;
			}
		}

		return {
			anime,
			hasWonToday,
			hasFailedToday,
		};
	}),

	// Get or create today's wordle game session for the current user
	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated GameSession model
		let session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.WORDLE,
				},
			},
			include: {
				guesses: true,
			},
		});

		// If no session exists, create one
		if (!session) {
			// Get today's anime from consolidated DailySchedule
			const dailySchedule = await ctx.db.dailySchedule.findUnique({
				where: {
					date_gameType: {
						date: today,
						gameType: GAME_TYPES.WORDLE,
					},
				},
			});

			if (!dailySchedule?.animeId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No anime selected for today',
				});
			}

			session = await ctx.db.gameSession.create({
				data: {
					userId: ctx.session.user.id,
					gameType: GAME_TYPES.WORDLE,
					date: today,
					targetId: String(dailySchedule.animeId),
				},
				include: {
					guesses: true,
				},
			});
		}

		return session;
	}),

	// Add a guess to today's session
	addGameGuess: protectedProcedure
		.input(z.object({ guessData: z.record(z.unknown()) }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Get or create session using consolidated model
			let session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.WORDLE,
					},
				},
			});

			if (!session) {
				const dailySchedule = await ctx.db.dailySchedule.findUnique({
					where: {
						date_gameType: {
							date: today,
							gameType: GAME_TYPES.WORDLE,
						},
					},
				});

				if (!dailySchedule?.animeId) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'No anime selected for today',
					});
				}

				session = await ctx.db.gameSession.create({
					data: {
						userId: ctx.session.user.id,
						gameType: GAME_TYPES.WORDLE,
						date: today,
						targetId: String(dailySchedule.animeId),
					},
				});
			}

			// Add guess using consolidated GameGuess model
			const guess = await ctx.db.gameGuess.create({
				data: {
					sessionId: session.id,
					guessData: input.guessData as Prisma.InputJsonValue,
				},
			});

			return guess;
		}),

	checkDateScheduled: adminProcedure
		.input(z.object({ date: z.date() }))
		.query(async ({ ctx, input }) => {
			// Normalize the input date to midnight UTC
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
						gameType: GAME_TYPES.WORDLE,
					},
				},
			});

			return { hasSchedule: !!schedule };
		}),

	scheduleDaily: adminProcedure
		.input(
			z.object({
				animeId: z.number().int(),
				date: z.date(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Normalize the input date to midnight UTC
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
			return ctx.db.dailySchedule.upsert({
				where: {
					date_gameType: {
						date: targetDate,
						gameType: GAME_TYPES.WORDLE,
					},
				},
				update: { animeId: input.animeId },
				create: {
					date: targetDate,
					gameType: GAME_TYPES.WORDLE,
					animeId: input.animeId,
				},
			});
		}),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		// Session is created in getTodaysSession, so we just need to verify it exists
		const today = getLondonMidnightUTC();
		const session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.WORDLE,
				},
			},
		});

		if (!session) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Game session not found',
			});
		}

		// The guess is added in addGuess mutation
		return { success: true };
	}),

	submitWin: protectedProcedure
		.input(z.object({ tries: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Update session to mark as won using consolidated model
			await ctx.db.gameSession.update({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.WORDLE,
					},
				},
				data: {
					won: true,
				},
			});

			// Update user stats
			await incrementWin(
				ctx.db,
				ctx.session.user.id,
				GAME_TYPES.WORDLE,
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
					gameType: GAME_TYPES.WORDLE,
				},
			},
			data: {
				failed: true,
			},
		});
	}),

	getLeaderboard: publicProcedure.query(
		async ({ ctx }): Promise<LeaderboardEntry[]> => {
			const leaderboard = await getLeaderboard(
				ctx.db,
				GAME_TYPES.WORDLE,
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

	// Banner Game Routes
	getBannerAnswerAnime: publicProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated DailySchedule model
		const schedule = await ctx.db.dailySchedule.findUnique({
			where: {
				date_gameType: {
					date: today,
					gameType: GAME_TYPES.BANNER,
				},
			},
			include: {
				anime: {
					select: {
						id: true,
						title: true,
						image: true,
					},
				},
			},
			cacheStrategy: CACHE_STRATEGIES.DAILY,
		});

		const anime = schedule?.anime ?? null;

		if (!anime) {
			return {
				anime: null,
				hasWonToday: false,
				hasFailedToday: false,
			};
		}

		let hasWonToday = false;
		let hasFailedToday = false;

		if (ctx.session?.user) {
			// Use consolidated GameSession model
			const session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.BANNER,
					},
				},
			});

			if (session) {
				hasWonToday = session.won;
				hasFailedToday = session.failed;
			}
		}

		return {
			anime,
			hasWonToday,
			hasFailedToday,
		};
	}),

	getBannerTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		// Use consolidated GameSession model
		let session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.BANNER,
				},
			},
			include: {
				guesses: true,
			},
		});

		if (!session) {
			const dailySchedule = await ctx.db.dailySchedule.findUnique({
				where: {
					date_gameType: {
						date: today,
						gameType: GAME_TYPES.BANNER,
					},
				},
			});

			if (!dailySchedule?.animeId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No banner anime selected for today',
				});
			}

			session = await ctx.db.gameSession.create({
				data: {
					userId: ctx.session.user.id,
					gameType: GAME_TYPES.BANNER,
					date: today,
					targetId: String(dailySchedule.animeId),
				},
				include: {
					guesses: true,
				},
			});
		}

		// Fetch anime titles for all guesses
		// GuessData for banner contains { animeId: number }
		const guessesWithTitles = await Promise.all(
			session.guesses.map(async (guess) => {
				const guessData = guess.guessData as { animeId?: number };
				const animeId = guessData?.animeId;
				let animeTitle = 'Unknown';

				if (animeId) {
					const anime = await ctx.db.anime.findUnique({
						where: { id: animeId },
						select: { title: true },
					});
					animeTitle = anime?.title ?? 'Unknown';
				}

				return {
					...guess,
					animeId: animeId ?? 0,
					animeTitle,
				};
			}),
		);

		return {
			...session,
			guesses: guessesWithTitles,
		};
	}),

	addBannerGuess: protectedProcedure
		.input(z.object({ animeId: z.number().int() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Use consolidated GameSession model
			let session = await ctx.db.gameSession.findUnique({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.BANNER,
					},
				},
			});

			if (!session) {
				const dailySchedule = await ctx.db.dailySchedule.findUnique({
					where: {
						date_gameType: {
							date: today,
							gameType: GAME_TYPES.BANNER,
						},
					},
				});

				if (!dailySchedule?.animeId) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'No banner anime selected for today',
					});
				}

				session = await ctx.db.gameSession.create({
					data: {
						userId: ctx.session.user.id,
						gameType: GAME_TYPES.BANNER,
						date: today,
						targetId: String(dailySchedule.animeId),
					},
				});
			}

			// Fetch the anime title
			const anime = await ctx.db.anime.findUnique({
				where: { id: input.animeId },
				select: { title: true },
			});

			// Use consolidated GameGuess model with guessData containing animeId
			const guess = await ctx.db.gameGuess.create({
				data: {
					sessionId: session.id,
					guessData: { animeId: input.animeId },
				},
			});

			// Return guess with anime title
			return {
				...guess,
				animeId: input.animeId,
				animeTitle: anime?.title ?? 'Unknown',
			};
		}),

	recordBannerGuess: protectedProcedure.mutation(async ({ ctx }) => {
		// Session is created in getBannerTodaysSession, so we just need to verify it exists
		const today = getLondonMidnightUTC();
		const session = await ctx.db.gameSession.findUnique({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.BANNER,
				},
			},
		});

		if (!session) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Game session not found',
			});
		}

		// The guess is added in addBannerGuess mutation
		return { success: true };
	}),

	submitBannerWin: protectedProcedure
		.input(z.object({ tries: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const today = getLondonMidnightUTC();

			// Use consolidated GameSession model
			await ctx.db.gameSession.update({
				where: {
					userId_date_gameType: {
						userId: ctx.session.user.id,
						date: today,
						gameType: GAME_TYPES.BANNER,
					},
				},
				data: {
					won: true,
				},
			});

			await incrementWin(
				ctx.db,
				ctx.session.user.id,
				GAME_TYPES.BANNER,
				input.tries,
			);

			return { success: true };
		}),

	submitBannerLoss: protectedProcedure.mutation(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

		return ctx.db.gameSession.update({
			where: {
				userId_date_gameType: {
					userId: ctx.session.user.id,
					date: today,
					gameType: GAME_TYPES.BANNER,
				},
			},
			data: {
				failed: true,
			},
		});
	}),

	getBannerLeaderboard: publicProcedure.query(
		async ({ ctx }): Promise<LeaderboardEntry[]> => {
			const leaderboard = await getLeaderboard(
				ctx.db,
				GAME_TYPES.BANNER,
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

	scheduleDailyBanner: adminProcedure
		.input(
			z.object({
				animeId: z.number().int(),
				date: z.date(),
			}),
		)
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

			// Use consolidated DailySchedule model
			return ctx.db.dailySchedule.upsert({
				where: {
					date_gameType: {
						date: targetDate,
						gameType: GAME_TYPES.BANNER,
					},
				},
				update: { animeId: input.animeId },
				create: {
					date: targetDate,
					gameType: GAME_TYPES.BANNER,
					animeId: input.animeId,
				},
			});
		}),

	checkBannerDateScheduled: adminProcedure
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
						gameType: GAME_TYPES.BANNER,
					},
				},
			});

			return { hasSchedule: !!schedule };
		}),
});
