import {
	adminProcedure,
	publicProcedure,
	createTRPCRouter,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET, R2_PUBLIC_URL, r2Client } from '~/server/r2-client';

const fileUploadSchema = z.object({
	base64: z.string().startsWith('data:'),
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
});

const createItemInputSchema = z.object({
	alt: z.string().min(1),
	category: z.string().min(1),
	year: z.number(),
	sourceImage: fileUploadSchema,
	thumbnailImage: fileUploadSchema,
});

async function uploadToR2(
	fileData: z.infer<typeof fileUploadSchema>,
	dbId: number,
	device: 'source' | 'thumbnail',
): Promise<string> {
	const { base64, fileName, mimeType } = fileData;

	const base64Data = base64.split(';base64,').pop();
	if (!base64Data) {
		throw new Error('Invalid base64 data received.');
	}

	const imageBuffer = Buffer.from(base64Data, 'base64');

	const key = `image/${dbId}/${device}_${fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

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
		console.error(error);

		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: `File upload failed for ${device} image. Check server logs for the specific R2 error code.`,
		});
	}

	return `${R2_PUBLIC_URL}/${key}`;
}

const getKeyFromUrl = (url: string): string | null => {
	if (!url?.startsWith(R2_PUBLIC_URL)) {
		return null;
	}
	return url.substring(R2_PUBLIC_URL.length + 1);
};

export const imageRouter = createTRPCRouter({
	getAllItems: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.image.findMany({
			select: {
				id: true,
				alt: true,
			},
			orderBy: { id: 'asc' },
		});
	}),
	deleteItem: adminProcedure
		.input(z.object({ id: z.number().int().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const itemId = input.id;

			const itemToDelete = await ctx.db.image.findUnique({
				where: { id: itemId },
				select: { source: true, thumbnailSource: true },
			});

			if (!itemToDelete) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Image item not found in DB.',
				});
			}

			const sourceKey = getKeyFromUrl(itemToDelete.source);
			const thumbnailKey = getKeyFromUrl(itemToDelete.thumbnailSource);

			try {
				const deletePromises: Promise<unknown>[] = [];

				if (sourceKey) {
					deletePromises.push(
						r2Client.send(
							new DeleteObjectCommand({
								Bucket: R2_BUCKET,
								Key: sourceKey,
							}),
						),
					);
				}
				if (thumbnailKey) {
					deletePromises.push(
						r2Client.send(
							new DeleteObjectCommand({
								Bucket: R2_BUCKET,
								Key: thumbnailKey,
							}),
						),
					);
				}

				await Promise.allSettled(deletePromises);
			} catch (r2Error) {
				console.error(
					`R2 Deletion failed for item ID ${itemId}. Proceeding to DB deletion.`,
					r2Error,
				);
			}

			await ctx.db.image.delete({ where: { id: itemId } });

			return { success: true, itemId };
		}),
	createItem: adminProcedure
		.input(createItemInputSchema)
		.mutation(async ({ ctx, input }) => {
			let itemId: number | undefined;

			try {
				const placeholderItem = await ctx.db.image.create({
					data: {
						alt: input.alt,
						category: input.category,
						year: input.year,
						source: 'R2_URL_PENDING',
						thumbnailSource: 'R2_URL_PENDING',
					},
				});
				itemId = placeholderItem.id;

				const [source, thumbnailSource] = await Promise.all([
					uploadToR2(input.sourceImage, itemId, 'source'),
					uploadToR2(input.thumbnailImage, itemId, 'thumbnail'),
				]);

				const updatedImageItem = await ctx.db.image.update({
					where: { id: itemId },
					data: {
						source: source,
						thumbnailSource: thumbnailSource,
					},
				});

				return updatedImageItem;
			} catch (error) {
				console.error(error);

				if (itemId) {
					await ctx.db.image
						.delete({ where: { id: itemId } })
						.catch((e) => {
							console.error(
								'Failed to rollback (delete placeholder item):',
								e,
							);
						});
				}

				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message:
						'Failed to create carousel item or upload files. Database record was rolled back.',
					cause: error,
				});
			}
		}),
});
