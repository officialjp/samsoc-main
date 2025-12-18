import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from '~/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { startOfDay } from 'date-fns';

interface CharacterEntry {
	name?: string;
	role?: string; // or any other fields your JSON contains
}

export const studioRouter = createTRPCRouter({
	getAnswerStudio: publicProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		const schedule = await ctx.db.dailyStudio.findUnique({
			where: { date: today },
		});

		// Fallback studio if none scheduled
		const targetStudioName = schedule?.studioName ?? 'Madhouse';

		// Fetch all anime associated with this studio string
		const studioAnimes = await ctx.db.anime.findMany({
			where: { studios: { contains: targetStudioName } },
			orderBy: { score: 'desc' },
		});

		if (studioAnimes.length === 0) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'No anime data found for the target studio.',
			});
		}

		// Hint logic calculations
		const validScores = studioAnimes
			.map((a) => a.score)
			.filter((s): s is number => s !== null);
		const validYears = studioAnimes
			.map((a) => a.releasedYear)
			.filter((y): y is number => y !== null);

		// Calculate Prominent Source
		const sourceMap = studioAnimes.reduce(
			(acc, a) => {
				if (a.source) acc[a.source] = (acc[a.source] ?? 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
		const prominentSource =
			Object.entries(sourceMap).sort((a, b) => b[1] - a[1])[0]?.[0] ??
			'N/A';

		// Hint 4: Grab exactly 10 unique, formatted character names
		const characterNames = new Set<string>();
		for (const anime of studioAnimes) {
			if (characterNames.size >= 10) break;

			// Use a type assertion to our interface instead of 'any'
			const characters = anime.characters as CharacterEntry[] | null;

			if (Array.isArray(characters) && characters.length > 0) {
				// Safe access to the first character
				const charData = characters[0];

				if (charData?.name) {
					// Format "Lastname, Firstname" to "Firstname Lastname"
					const cleanName = charData.name.includes(',')
						? charData.name.split(',').reverse().join(' ').trim()
						: charData.name;

					characterNames.add(cleanName);
				}
			}
		}

		// Hint 5: 5 Notable Anime Titles
		const animeList = studioAnimes.slice(0, 5).map((a) => a.title);

		const studio = {
			id: targetStudioName,
			name: targetStudioName,
			avgRating:
				validScores.length > 0
					? validScores.reduce((a, b) => a + b, 0) /
						validScores.length
					: 0,
			firstAnimeYear: validYears.length > 0 ? Math.min(...validYears) : 0,
			lastAnimeYear: validYears.length > 0 ? Math.max(...validYears) : 0,
			prominentSource,
			characters: Array.from(characterNames),
			animeList,
		};

		// Check User progress
		let hasWonToday = false;
		let hasFailedToday = false;

		if (ctx.session?.user) {
			const user = await ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
				select: {
					studioLastWonAt: true,
					studioDailyGuesses: true,
					studioLastGuessAt: true,
				},
			});

			if (user) {
				const todayStr = today.toLocaleDateString('en-GB', {
					timeZone: 'Europe/London',
				});
				if (
					user.studioLastWonAt?.toLocaleDateString('en-GB', {
						timeZone: 'Europe/London',
					}) === todayStr
				) {
					hasWonToday = true;
				}
				if (
					!hasWonToday &&
					user.studioDailyGuesses >= 5 &&
					user.studioLastGuessAt?.toLocaleDateString('en-GB', {
						timeZone: 'Europe/London',
					}) === todayStr
				) {
					hasFailedToday = true;
				}
			}
		}

		return { studio, hasWonToday, hasFailedToday };
	}),

	getAllStudios: publicProcedure.query(async ({ ctx }) => {
		const animes = await ctx.db.anime.findMany({
			select: { studios: true },
		});

		const uniqueStudios = new Set<string>();
		animes.forEach((a) => {
			if (a.studios) {
				// Split comma-separated studios and trim whitespace
				a.studios.split(',').forEach((s) => {
					const clean = s.trim();
					if (clean) uniqueStudios.add(clean);
				});
			}
		});

		return Array.from(uniqueStudios)
			.sort()
			.map((name) => ({
				id: name,
				name,
			}));
	}),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
		});

		if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

		const now = new Date();
		const todayStr = now.toLocaleDateString('en-GB', {
			timeZone: 'Europe/London',
		});
		const lastGuessStr = user.studioLastGuessAt?.toLocaleDateString(
			'en-GB',
			{
				timeZone: 'Europe/London',
			},
		);

		// Increment if same day, otherwise reset to 1
		const newCount =
			todayStr === lastGuessStr ? user.studioDailyGuesses + 1 : 1;

		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: {
				studioDailyGuesses: newCount,
				studioLastGuessAt: now,
			},
		});
	}),

	// Get or create today's game session for the current user
	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		let session = await ctx.db.studioGameSession.findUnique({
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
			// Get today's studio answer
			const dailyStudio = await ctx.db.dailyStudio.findUnique({
				where: { date: today },
			});

			const studioId = dailyStudio?.studioName ?? 'Madhouse';

			session = await ctx.db.studioGameSession.create({
				data: {
					userId: ctx.session.user.id,
					date: today,
					studioId,
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
		.input(z.object({ studioName: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const now = new Date();
			const today = new Date(
				now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
			);
			today.setHours(0, 0, 0, 0);

			// Get or create session
			let session = await ctx.db.studioGameSession.findUnique({
				where: {
					userId_date: {
						userId: ctx.session.user.id,
						date: today,
					},
				},
			});

			if (!session) {
				const dailyStudio = await ctx.db.dailyStudio.findUnique({
					where: { date: today },
				});

				const studioId = dailyStudio?.studioName ?? 'Madhouse';

				session = await ctx.db.studioGameSession.create({
					data: {
						userId: ctx.session.user.id,
						date: today,
						studioId,
					},
				});
			}

			// Add guess to session
			const guess = await ctx.db.studioGuess.create({
				data: {
					sessionId: session.id,
					studioName: input.studioName,
				},
			});

			return guess;
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
			await ctx.db.studioGameSession.update({
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
					studioWins: { increment: 1 },
					studioTotalTries: { increment: input.tries },
					studioLastWonAt: new Date(),
				},
			});
		}),

	// Mark session as failed
	submitLoss: protectedProcedure.mutation(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		return ctx.db.studioGameSession.update({
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
			where: { studioWins: { gt: 0 } },
			orderBy: [{ studioWins: 'desc' }, { studioTotalTries: 'asc' }],
			take: 10,
			select: {
				id: true,
				name: true,
				studioWins: true,
				studioTotalTries: true,
			},
		});
	}),

	scheduleDaily: adminProcedure
		.input(z.object({ studioName: z.string(), date: z.date() }))
		.mutation(async ({ ctx, input }) => {
			const targetDate = new Date(input.date);
			targetDate.setHours(0, 0, 0, 0);

			return ctx.db.dailyStudio.upsert({
				where: { date: targetDate },
				update: { studioName: input.studioName },
				create: {
					date: targetDate,
					studioName: input.studioName,
				},
			});
		}),
});
