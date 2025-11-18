import {
	adminProcedure,
	publicProcedure,
	createTRPCRouter,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { Prisma } from '@prisma/client';

const createItemInputSchema = z.object({
	title: z.string().nonempty(),
	description: z.string().nonempty(),
	location: z.string().nonempty(),
	date: z.date(),
	color: z.string().nonempty(),
	is_regular_session: z.boolean(),
	session_count: z.preprocess(
		(a) => (a === '' ? undefined : a),
		z.number().optional().nullable(),
	),
});

export const eventRouter = createTRPCRouter({
	getAllItems: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.event.findMany({
			select: {
				id: true,
				title: true,
			},
		});
	}),
	deleteItem: adminProcedure
		.input(z.object({ id: z.number().int().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const itemId = input.id;

			try {
				await ctx.db.event.delete({ where: { id: itemId } });
			} catch (error) {
				if (
					error instanceof Prisma.PrismaClientKnownRequestError &&
					error.code === 'P2025'
				) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Event item not found in DB.',
					});
				}
				throw error;
			}

			return { success: true, itemId };
		}),

	createItem: adminProcedure
		.input(createItemInputSchema)
		.mutation(async ({ ctx, input }) => {
			try {
				const newEventItem = await ctx.db.event.create({
					data: {
						title: input.title,
						description: input.description,
						location: input.location,
						date: input.date,
						color: input.color,
						is_regular_session: input.is_regular_session,
						session_count: input.session_count,
					},
				});

				return newEventItem;
			} catch (error) {
				console.error('Failed to create event item:', error);

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create event item.',
					cause: error,
				});
			}
		}),
});
