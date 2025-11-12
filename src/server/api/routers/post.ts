import { z } from 'zod';

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from '~/server/api/trpc';

export const postRouter = createTRPCRouter({
	hello: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input }) => {
			return {
				greeting: `Hello ${input.text}`,
			};
		}),

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
