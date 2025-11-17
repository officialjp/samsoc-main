import z from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

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
		const images = await ctx.db.image.findMany({
			select: {
				id: true,
				source: true,
				thumbnailSource: true,
				alt: true,
				category: true,
				year: true,
				createdAt: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		return {
			data: images,
			total: images.length,
		};
	}),

	getCarouselItem: publicProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const carouselItem = await ctx.db.carousel.findFirst({
				where: {
					id: input.id,
				},
			});
			return { data: carouselItem };
		}),

	getCarouselIdAndName: publicProcedure.query(async ({ ctx }) => {
		const allIdAndNames = await ctx.db.carousel.findMany({
			select: { id: true, alt: true },
		});
		return { data: allIdAndNames };
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
});
