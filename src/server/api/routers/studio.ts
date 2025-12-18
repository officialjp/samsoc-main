import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from '~/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

interface CharacterEntry {
	name?: string;
	role?: string;
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

		const targetStudioName = schedule?.studioName ?? 'Madhouse';

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

		// FILTER: Define recognizable pool (Score >= 7.5)
		const highRatedAnime = studioAnimes.filter(
			(a) => (a.score ?? 0) >= 7.5,
		);
		// Fallback to full list if the studio is small/new and has no 7.5+ shows
		const recognizableSourcePool =
			highRatedAnime.length > 0 ? highRatedAnime : studioAnimes;

		const validScores = studioAnimes
			.map((a) => a.score)
			.filter((s): s is number => s !== null);
		const validYears = studioAnimes
			.map((a) => a.releasedYear)
			.filter((y): y is number => y !== null);

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

		// Hint 4: Characters from high-rated shows (Shuffled)
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

					if (!characterList.includes(cleanName)) {
						characterList.push(cleanName);
					}
				}
			}
		}

		// Fisher-Yates Shuffle for character names
		for (let i = characterList.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[characterList[i], characterList[j]] = [
				characterList[j]!,
				characterList[i]!,
			];
		}

		// Hint 5: Top 5 Notable Anime Titles (Already sorted by score desc)
		const animeList = recognizableSourcePool
			.slice(0, 5)
			.map((a) => a.title);

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
			characters: characterList,
			animeList,
		};

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
			{ timeZone: 'Europe/London' },
		);

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

	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		let session = await ctx.db.studioGameSession.findUnique({
			where: {
				userId_date: { userId: ctx.session.user.id, date: today },
			},
			include: { guesses: true },
		});

		if (!session) {
			const dailyStudio = await ctx.db.dailyStudio.findUnique({
				where: { date: today },
			});
			const studioId = dailyStudio?.studioName ?? 'Madhouse';
			session = await ctx.db.studioGameSession.create({
				data: { userId: ctx.session.user.id, date: today, studioId },
				include: { guesses: true },
			});
		}
		return session;
	}),

	addGameGuess: protectedProcedure
		.input(z.object({ studioName: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const now = new Date();
			const today = new Date(
				now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
			);
			today.setHours(0, 0, 0, 0);

			let session = await ctx.db.studioGameSession.findUnique({
				where: {
					userId_date: { userId: ctx.session.user.id, date: today },
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

			return ctx.db.studioGuess.create({
				data: { sessionId: session.id, studioName: input.studioName },
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

			await ctx.db.studioGameSession.update({
				where: {
					userId_date: { userId: ctx.session.user.id, date: today },
				},
				data: { won: true },
			});

			return ctx.db.user.update({
				where: { id: ctx.session.user.id },
				data: {
					studioWins: { increment: 1 },
					studioTotalTries: { increment: input.tries },
					studioLastWonAt: new Date(),
				},
			});
		}),

	submitLoss: protectedProcedure.mutation(async ({ ctx }) => {
		const now = new Date();
		const today = new Date(
			now.toLocaleString('en-US', { timeZone: 'Europe/London' }),
		);
		today.setHours(0, 0, 0, 0);

		return ctx.db.studioGameSession.update({
			where: {
				userId_date: { userId: ctx.session.user.id, date: today },
			},
			data: { failed: true },
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
				create: { date: targetDate, studioName: input.studioName },
			});
		}),
});
