import {
	publicProcedure,
	createTRPCRouter,
	adminProcedure,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET, r2Client, R2_PUBLIC_URL } from '~/server/r2-client';
import { CACHE_STRATEGIES } from '~/server/api/helpers/cache';

const fileUploadSchema = z.object({
	base64: z.string().startsWith('data:'),
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
});

async function uploadToR2(
	fileData: z.infer<typeof fileUploadSchema>,
	dbId: number,
): Promise<string> {
	const { base64, fileName, mimeType } = fileData;

	const base64Data = base64.split(';base64,').pop();
	if (!base64Data) {
		throw new Error('Invalid base64 data received.');
	}

	const imageBuffer = Buffer.from(base64Data, 'base64');

	const key = `committee/${dbId}/${fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

	try {
		await r2Client.send(
			new PutObjectCommand({
				Bucket: R2_BUCKET,
				Key: key,
				Body: imageBuffer,
				ContentType: mimeType,
			}),
		);
	} catch (error) {
		console.error('--- R2 UPLOAD FAILURE ---', error);
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `File upload failed. Check server logs for R2 error.`,
		});
	}

	return `${R2_PUBLIC_URL}/${key}`;
}

const getKeyFromUrl = (url: string | null | undefined): string | null => {
	if (!url || !R2_PUBLIC_URL || !url.startsWith(R2_PUBLIC_URL)) {
		return null;
	}
	return url.substring(R2_PUBLIC_URL.length + 1);
};

async function deleteFromR2(url: string | null | undefined): Promise<void> {
	const key = getKeyFromUrl(url);
	if (!key) {
		return;
	}
	try {
		await r2Client.send(
			new DeleteObjectCommand({
				Bucket: R2_BUCKET,
				Key: key,
			}),
		);
	} catch (error) {
		console.error(`Failed to delete R2 object with key: ${key}`, error);
	}
}

const updateMemberInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	role: z.string().optional(),
	newImage: fileUploadSchema.optional(),
});

export const committeeRouter = createTRPCRouter({
	getAllMembers: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.committee.findMany({
			orderBy: { id: 'asc' },
			cacheStrategy: CACHE_STRATEGIES.STATIC,
		});
	}),

	/**
	 * Optimized query for public landing page - only fetches display fields
	 * Used by: CommitteeSection on landing page
	 */
	getPublicMembers: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.committee.findMany({
			select: {
				id: true,
				name: true,
				role: true,
				source: true,
			},
			orderBy: { id: 'asc' },
			cacheStrategy: CACHE_STRATEGIES.STATIC,
		});
	}),

	updateMember: adminProcedure
		.input(updateMemberInputSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, name, role, newImage } = input;

			const updateData: {
				name?: string;
				role?: string;
				source?: string | null;
			} = {};
			if (name !== undefined) updateData.name = name;
			if (role !== undefined) updateData.role = role;

			let oldSourceUrl: string | null | undefined;
			if (newImage) {
				const currentMember = await ctx.db.committee.findUnique({
					where: { id },
					select: { source: true },
				});

				if (!currentMember) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Committee member not found.',
					});
				}

				oldSourceUrl = currentMember.source;

				const newSourceUrl = await uploadToR2(newImage, id);
				updateData.source = newSourceUrl;
			}

			const updatedMember = await ctx.db.committee.update({
				where: { id },
				data: updateData,
			});

			if (newImage && oldSourceUrl) {
				await deleteFromR2(oldSourceUrl);
			}

			return updatedMember;
		}),
});
