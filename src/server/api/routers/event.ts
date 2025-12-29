import {
	adminProcedure,
	publicProcedure,
	createTRPCRouter,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { Prisma } from 'generated/prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

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

	getSpecialEvents: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.event.findMany({
			where: { is_regular_session: false },
			select: {
				id: true,
				title: true,
				description: true,
				location: true,
				date: true,
				color: true,
				is_regular_session: true,
				session_count: true,
			},
		});
	}),

	getRegularSessions: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.event.findMany({
			where: { is_regular_session: true },
			select: {
				id: true,
				title: true,
				description: true,
				location: true,
				date: true,
				color: true,
				is_regular_session: true,
				session_count: true,
			},
		});
	}),

	/**
	 * Gets events for a specific month with pagination support.
	 * Includes both special events and generated weekly sessions.
	 */
	getEventsPaginated: publicProcedure
		.input(
			z.object({
				year: z.number().int(),
				month: z.number().int().min(0).max(11), // 0-11 for JavaScript Date months
			}),
		)
		.query(async ({ ctx, input }) => {
			const { year, month } = input;

			// Create date range for the specified month
			const monthStart = startOfMonth(new Date(year, month));
			const monthEnd = endOfMonth(new Date(year, month));

			// Fetch special events in the month
			const specialEvents = await ctx.db.event.findMany({
				where: {
					is_regular_session: false,
					date: {
						gte: monthStart,
						lte: monthEnd,
					},
				},
				select: {
					id: true,
					title: true,
					description: true,
					location: true,
					date: true,
					color: true,
					is_regular_session: true,
					session_count: true,
				},
			});

			// Fetch regular sessions that could generate events in this month
			// We need to fetch sessions that start before or during this month
			// and could generate weekly sessions that fall within this month
			const regularSessions = await ctx.db.event.findMany({
				where: {
					is_regular_session: true,
					date: {
						lte: monthEnd, // Session starts before or during this month
					},
				},
				select: {
					id: true,
					title: true,
					description: true,
					location: true,
					date: true,
					color: true,
					is_regular_session: true,
					session_count: true,
				},
			});

			// Generate weekly sessions and filter for current month
			const weeklySessions = [];
			for (const session of regularSessions) {
				const sessionCount = session.session_count ?? 0;
				if (sessionCount === 0) continue;

				let currentDate = new Date(session.date);

				// Add voting session if it's in the current month
				if (currentDate >= monthStart && currentDate <= monthEnd) {
					weeklySessions.push({
						id: session.id,
						title: 'Voting Session',
						description:
							'Sit down with us and vote on which 3 animes we will be watching this semester!',
						location: session.location,
						date: new Date(currentDate),
						color: 'bg-purple-200',
						is_regular_session: true,
						session_count: null,
					});
				}

				// Generate weekly sessions
				for (let i = 1; i < sessionCount; i++) {
					currentDate = new Date(
						currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
					);

					// Only include if in current month
					if (currentDate >= monthStart && currentDate <= monthEnd) {
						weeklySessions.push({
							id: session.id,
							title: session.title,
							description: session.description,
							location: session.location,
							date: new Date(currentDate),
							color: 'bg-purple-200',
							is_regular_session: true,
							session_count: null,
						});
					}

					// Stop if we've gone past the month
					if (currentDate > monthEnd) break;
				}
			}

			const allEvents = [...specialEvents, ...weeklySessions];

			return {
				events: allEvents,
				totalCount: allEvents.length,
			};
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
