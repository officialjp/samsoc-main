// server/api/routers/admin.ts
import { z } from 'zod';
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const adminRouter = createTRPCRouter({
	getAllUsers: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});
	}),

	updateUserRole: adminProcedure
		.input(
			z.object({
				userId: z.string(),
				newRole: z.enum(['user', 'admin']),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (
				input.userId === ctx.session.user.id &&
				input.newRole !== 'admin'
			) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'You cannot demote yourself',
				});
			}

			return ctx.db.user.update({
				where: { id: input.userId },
				data: { role: input.newRole },
			});
		}),
});
