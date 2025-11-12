import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
	getCarouselData: publicProcedure.query(async ({ ctx }) => {
		const allImages = await ctx.db.carousel.findMany({});
		return { data: allImages };
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
		const allMembers = await ctx.db.committee.findMany({
			orderBy: [{ id: 'asc' }],
		});
		return { data: allMembers };
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return 'you can now see this secret message!';
	}),
});
