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

/**
 * Gets the London date string for comparison purposes.
 */
function getLondonDateString(date: Date): string {
	return date.toLocaleDateString('en-GB', { timeZone: 'Europe/London' });
}

export const studioRouter = createTRPCRouter({
	getAnswerStudio: publicProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

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

		const highRatedAnime = studioAnimes.filter(
			(a) => (a.score ?? 0) >= 7.5,
		);
		const recognizableSourcePool =
			highRatedAnime.length > 0 ? highRatedAnime : studioAnimes;

		// --- GENRE AGGREGATION ---
		const genreMap = studioAnimes.reduce(
			(acc, a) => {
				if (a.genres) {
					const splitGenres = a.genres
						.split(',')
						.map((g) => g.trim());
					splitGenres.forEach((genre) => {
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
			topGenres,
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
				const todayStr = getLondonDateString(new Date());

				if (user.studioLastWonAt) {
					const lastWonStr = getLondonDateString(
						user.studioLastWonAt,
					);
					hasWonToday = todayStr === lastWonStr;
				}

				if (
					!hasWonToday &&
					user.studioDailyGuesses >= 5 &&
					user.studioLastGuessAt
				) {
					const lastGuessStr = getLondonDateString(
						user.studioLastGuessAt,
					);
					hasFailedToday = todayStr === lastGuessStr;
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
			.map((name) => ({ id: name, name }));
	}),

	recordGuess: protectedProcedure.mutation(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
		});
		if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

		const now = new Date();
		const todayStr = getLondonDateString(now);
		const lastGuessStr = user.studioLastGuessAt
			? getLondonDateString(user.studioLastGuessAt)
			: null;

		const newCount =
			todayStr === lastGuessStr ? user.studioDailyGuesses + 1 : 1;

		return ctx.db.user.update({
			where: { id: ctx.session.user.id },
			data: { studioDailyGuesses: newCount, studioLastGuessAt: now },
		});
	}),

	getTodaysSession: protectedProcedure.query(async ({ ctx }) => {
		const today = getLondonMidnightUTC();

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
			const today = getLondonMidnightUTC();

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
			const today = getLondonMidnightUTC();

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
		const today = getLondonMidnightUTC();

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

			const schedule = await ctx.db.dailyStudio.findUnique({
				where: { date: targetDate },
			});

			return { hasSchedule: !!schedule };
		}),

	scheduleDaily: adminProcedure
		.input(z.object({ studioName: z.string(), date: z.date() }))
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

			return ctx.db.dailyStudio.upsert({
				where: { date: targetDate },
				update: { studioName: input.studioName },
				create: { date: targetDate, studioName: input.studioName },
			});
		}),
});
