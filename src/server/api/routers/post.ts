import { z } from 'zod';
import { unstable_cache } from 'next/cache'; // 🛑 NEW IMPORT

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
	// 🛑 IMPORTANT: Assuming your TRPC file exports the context type as 'Context
} from '~/server/api/trpc';

// 🛑 TYPE DEFINITION: Extract the type of ctx.db (your Prisma/Drizzle client)
const ctxTypeHelper = publicProcedure.query(async ({ ctx }) => ctx);
type ContextType = Awaited<ReturnType<typeof ctxTypeHelper>>;
type DBType = ContextType['db'];
const CAROUSEL_CACHE_KEY = ['carousel-images'];
const REVALIDATE_TIME = 60 * 60 * 24;
const fetchCarouselData = async (db: DBType) => {
	const allImages = await db.carousel.findMany({});
	return { data: allImages };
};

const getCachedCarouselData = unstable_cache(
	async (db: DBType) => fetchCarouselData(db),
	CAROUSEL_CACHE_KEY,
	{
		revalidate: REVALIDATE_TIME,
	},
);

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

	getCarouselData: publicProcedure.query(async ({ ctx }) => {
		return await getCachedCarouselData(ctx.db);
	}),

	getAnimeCardData: publicProcedure.query(async ({ ctx }) => {
		const allCards = await ctx.db.animeCard.findMany({
			include: {
				genres: true,
			},
		});
		return { data: allCards };
	}),

	getMangaData: publicProcedure.query(async ({ ctx }) => {
		const allManga = await ctx.db.manga.findMany({
			include: { genres: true },
			orderBy: [{ id: 'asc' }],
		});

		return { data: allManga };
	}),

	getImageData: publicProcedure.query(async ({ ctx }) => {
		const allImages = await ctx.db.image.findMany({});
		return { data: allImages };
	}),

	getSpecialEvents: publicProcedure.query(async ({ ctx }) => {
		const allEvents = await ctx.db.event.findMany({
			where: { is_regular_session: false },
		});
		return { data: allEvents };
	}),

	getRegularSessions: publicProcedure.query(async ({ ctx }) => {
		const allRegularSessions = await ctx.db.event.findMany({
			where: { is_regular_session: true },
		});
		return { data: allRegularSessions };
	}),

	getCommitteeMembers: publicProcedure.query(async ({ ctx }) => {
		const allMembers = await ctx.db.committee.findMany({});
		return { data: allMembers };
	}),

	create: protectedProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.post.create({
				data: {
					name: input.name,
					createdBy: { connect: { id: ctx.session.user.id } },
				},
			});
		}),

	getLatest: protectedProcedure.query(async ({ ctx }) => {
		const post = await ctx.db.post.findFirst({
			orderBy: { createdAt: 'desc' },
			where: { createdBy: { id: ctx.session.user.id } },
		});

		return post ?? null;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return 'you can now see this secret message!';
	}),
});
