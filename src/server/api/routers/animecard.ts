import {
	publicProcedure,
	createTRPCRouter,
	adminProcedure,
} from '~/server/api/trpc';
import * as z from 'zod';
import { type Prisma } from 'generated/prisma/client';

const updateAnimeCardInputSchema = z.object({
	id: z.number().int(),
	title: z.string().min(1, 'Title is required').optional(),
	episode: z.string().optional(),
	mal_link: z
		.string()
		.url('Must be a valid URL')
		.optional()
		.or(z.literal('')),
	total_episodes: z
		.number()
		.int()
		.min(1, 'Must have at least 1 episode')
		.optional(),
	show_type: z.string().optional(),
	source: z.string().url('Must be a valid URL').optional(),
	studio: z.string().optional(),
});

// Type helper for getPublicCards query
const getPublicCardsSelect = {
	id: true,
	title: true,
	episode: true,
	total_episodes: true,
	mal_link: true,
	show_type: true,
	studio: true,
	source: true,
	genres: {
		select: {
			id: true,
			name: true,
		},
	},
} satisfies Prisma.AnimeCardSelect;

// Extract the return type
export type GetPublicCardsResult = Prisma.AnimeCardGetPayload<{
	select: {
		id: true;
		title: true;
		episode: true;
		total_episodes: true;
		mal_link: true;
		show_type: true;
		studio: true;
		source: true;
		genres: {
			select: {
				id: true;
				name: true;
			};
		};
	};
}>[];

export const animeCardsRouter = createTRPCRouter({
	getAllCards: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.animeCard.findMany({
			orderBy: { id: 'asc' },
		});
	}),

	/**
	 * Optimized query for landing page - includes genres and only necessary fields
	 * Used by public-facing pages for better LCP/FCP
	 */
	getPublicCards: publicProcedure.query(
		async ({ ctx }): Promise<GetPublicCardsResult> => {
			const result = await ctx.db.animeCard.findMany({
				select: getPublicCardsSelect,
				orderBy: { id: 'asc' },
			});
			return result as GetPublicCardsResult;
		},
	),

	updateCard: adminProcedure
		.input(updateAnimeCardInputSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...dataToUpdate } = input;

			const updateData: Prisma.AnimeCardUpdateInput = {
				...dataToUpdate,
			};

			const updatedCard = await ctx.db.animeCard.update({
				where: { id },
				data: updateData,
			});

			return updatedCard;
		}),
});
