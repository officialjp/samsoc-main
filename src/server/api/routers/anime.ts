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
			return ctx.db.user.update({
				where: { id: ctx.session.user.id },
				data: {
					wordleWins: { increment: 1 },
					wordleTotalTries: { increment: input.tries },
					wordleLastWonAt: now,
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
