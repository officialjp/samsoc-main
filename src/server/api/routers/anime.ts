import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from '~/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const animeRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ id: z.number().int() }))
		.query(async ({ ctx, input }) => {
			return ctx.db.anime.findUnique({
				where: { id: input.id },
				select: {
					releasedYear: true,
					releasedSeason: true,
					score: true,
					source: true,
					studios: true,
					themes: true,
					title: true,
					genres: true,
				},
			});
		}),

	getAnswerAnime: publicProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		const schedule = await ctx.db.dailyAnime.findUnique({
			where: { date: today },
			include: {
				anime: {
					select: {
						id: true,
						title: true,
						releasedYear: true,
						releasedSeason: true,
						genres: true,
						themes: true,
						studios: true,
						source: true,
						score: true,
					},
				},
			},
		});

		let anime = schedule?.anime;

		if (!anime) {
			const fallback = await ctx.db.anime.findUnique({
				where: { id: 1 },
				select: {
					id: true,
					title: true,
					releasedYear: true,
					releasedSeason: true,
					genres: true,
					themes: true,
					studios: true,
					source: true,
					score: true,
				},
			});

			anime = fallback ?? undefined;
		}

		if (!anime) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message:
					'No daily anime scheduled and fallback anime (ID: 1) not found.',
			});
		}

		if (!anime) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'No daily anime or fallback anime found in database.',
			});
		}

		let hasWonToday = false;
		let hasFailedToday = false;

		if (ctx.session?.user) {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
				select: {
					wordleLastWonAt: true,
					wordleDailyGuesses: true,
					wordleLastGuessAt: true,
				},
			});

			if (user) {
				const todayStr = today.toLocaleDateString('en-GB', {
					timeZone: 'Europe/London',
				});

				if (user.wordleLastWonAt) {
					const lastWonStr = user.wordleLastWonAt.toLocaleDateString(
						'en-GB',
						{ timeZone: 'Europe/London' },
					);
					hasWonToday = todayStr === lastWonStr;
				}

				if (user.wordleLastGuessAt) {
					const lastGuessStr =
						user.wordleLastGuessAt.toLocaleDateString('en-GB', {
							timeZone: 'Europe/London',
						});

					if (
						todayStr === lastGuessStr &&
						user.wordleDailyGuesses >= 12 &&
						!hasWonToday
					) {
						hasFailedToday = true;
					}
				}
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
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		let session = await ctx.db.wordleGameSession.findUnique({
			where: {
				userId_date: {
					userId: ctx.session.user.id,
					date: today,
				},
			},
			include: {
				guesses: true,
			},
		});

		// If no session exists, create one
		if (!session) {
			// Get today's anime answer
			const dailyAnime = await ctx.db.dailyAnime.findUnique({
				where: { date: today },
			});

			if (!dailyAnime) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No anime selected for today',
				});
			}

			session = await ctx.db.wordleGameSession.create({
				data: {
					userId: ctx.session.user.id,
					date: today,
					animeId: dailyAnime.animeId,
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
			const now = new Date();
			const today = new Date(
				now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
			);
			today.setHours(0, 0, 0, 0);

			// Get or create session
			let session = await ctx.db.wordleGameSession.findUnique({
				where: {
					userId_date: {
						userId: ctx.session.user.id,
						date: today,
					},
				},
			});

			if (!session) {
				const dailyAnime = await ctx.db.dailyAnime.findUnique({
					where: { date: today },
				});

				if (!dailyAnime) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'No anime selected for today',
					});
				}

				session = await ctx.db.wordleGameSession.create({
					data: {
						userId: ctx.session.user.id,
						date: today,
						animeId: dailyAnime.animeId,
					},
				});
			}

			// Add guess to session
			const guess = await ctx.db.wordleGuess.create({
				data: {
					sessionId: session.id,
					guessData: input.guessData,
				},
			});

			return guess;
		}),

	scheduleDaily: adminProcedure
		.input(
			z.object({
				animeId: z.number().int(),
				date: z.date(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const targetDate = new Date(input.date);
			targetDate.setHours(0, 0, 0, 0);

			return ctx.db.dailyAnime.upsert({
				where: { date: targetDate },
				update: { animeId: input.animeId },
				create: {
					date: targetDate,
					animeId: input.animeId,
				},
			});
		}),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { wordleDailyGuesses: true, wordleLastGuessAt: true },
		});

		if (!user) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'User record not found',
			});
		}

		const now = new Date();
		const londonTime = { timeZone: 'Europe/London' };
		const todayStr = now.toLocaleDateString('en-GB', londonTime);

		let newCount = 1;
		if (user.wordleLastGuessAt) {
			const lastGuessStr = user.wordleLastGuessAt.toLocaleDateString(
				'en-GB',
				londonTime,
			);
			newCount =
				todayStr === lastGuessStr ? user.wordleDailyGuesses + 1 : 1;
		}

		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: {
				wordleDailyGuesses: newCount,
				wordleLastGuessAt: now,
			},
		});
	}),

	submitWin: protectedProcedure
		.input(z.object({ tries: z.number() }))
		.mutation(async ({ ctx, input }) => {
			const now = new Date();
			const today = new Date(
				now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
			);
			today.setHours(0, 0, 0, 0);

			// Update session to mark as won
			await ctx.db.wordleGameSession.update({
				where: {
					userId_date: {
						userId: ctx.session.user.id,
						date: today,
					},
				},
				data: {
					won: true,
				},
			});

			// Update user stats
			return ctx.db.user.update({
				where: { id: ctx.session.user.id },
				data: {
					wordleWins: { increment: 1 },
					wordleTotalTries: { increment: input.tries },
					wordleLastWonAt: new Date(),
				},
			});
		}),

	submitLoss: protectedProcedure.mutation(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		return ctx.db.wordleGameSession.update({
			where: {
				userId_date: {
					userId: ctx.session.user.id,
					date: today,
				},
			},
			data: {
				failed: true,
			},
		});
	}),

	getLeaderboard: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findMany({
			where: { wordleWins: { gt: 0 } },
			orderBy: [{ wordleWins: 'desc' }, { wordleTotalTries: 'asc' }],
			take: 10,
			select: {
				id: true,
				name: true,
				wordleWins: true,
				wordleTotalTries: true,
			},
		});
	}),
});
