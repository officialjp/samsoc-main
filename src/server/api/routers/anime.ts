import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from '~/server/api/trpc';
import { z } from 'zod';

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
		const anime = await ctx.db.anime.findUnique({
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

		let hasWonToday = false;
		let hasFailedToday = false;

		if (ctx.session?.user) {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
				select: {
					lastWonAt: true,
					dailyGuesses: true,
					lastGuessAt: true,
				},
			});

			if (user) {
				const now = new Date();
				const todayStr = now.toLocaleDateString('en-GB', {
					timeZone: 'Europe/London',
				});

				// Check Win Status
				if (user.lastWonAt) {
					const lastWonStr = user.lastWonAt.toLocaleDateString(
						'en-GB',
						{ timeZone: 'Europe/London' },
					);
					hasWonToday = todayStr === lastWonStr;
				}

				// Check Failure Status (Limit 12)
				if (user.lastGuessAt) {
					const lastGuessStr = user.lastGuessAt.toLocaleDateString(
						'en-GB',
						{ timeZone: 'Europe/London' },
					);
					if (
						todayStr === lastGuessStr &&
						user.dailyGuesses >= 12 &&
						!hasWonToday
					) {
						hasFailedToday = true;
					}
				}
			}
		}

		return { anime, hasWonToday, hasFailedToday };
	}),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { dailyGuesses: true, lastGuessAt: true },
		});

		const now = new Date();
		const londonTime = { timeZone: 'Europe/London' };
		const todayStr = now.toLocaleDateString('en-GB', londonTime);

		let newCount = 1;
		if (user?.lastGuessAt) {
			const lastGuessStr = user.lastGuessAt.toLocaleDateString(
				'en-GB',
				londonTime,
			);
			newCount = todayStr === lastGuessStr ? user.dailyGuesses + 1 : 1;
		}

		// Logic: If they hit 12, they have failed for the day
		// Note: Ensure your win logic clears this or takes precedence
		const hasFailed = newCount >= 12;

		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: {
				dailyGuesses: newCount,
				lastGuessAt: now,
				// Assuming this field exists in your schema based on your frontend usage
				hasFailedToday: hasFailed,
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
					wins: { increment: 1 },
					totalTries: { increment: input.tries },
					lastWonAt: now,
				},
			});
		}),

	getLeaderboard: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findMany({
			where: { wins: { gt: 0 } },
			orderBy: [{ wins: 'desc' }, { totalTries: 'asc' }],
			take: 10,
			select: { id: true, name: true, wins: true, totalTries: true },
		});
	}),
});
