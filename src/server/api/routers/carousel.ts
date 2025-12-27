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
//test

const createItemInputSchema = z.object({
	alt: z.string().min(1),
	order: z.number().int().min(0),
	mobileImage: fileUploadSchema,
	pcImage: fileUploadSchema,
});

async function uploadToR2(
	fileData: z.infer<typeof fileUploadSchema>,
	dbId: number,
	device: 'mobile' | 'desktop',
): Promise<string> {
	const { base64, fileName, mimeType } = fileData;

	const base64Data = base64.split(';base64,').pop();
	if (!base64Data) {
		throw new Error('Invalid base64 data received.');
	}

	const imageBuffer = Buffer.from(base64Data, 'base64');

	const key = `carousel/${dbId}/${device}_${fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

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

export const carouselRouter = createTRPCRouter({
	getAllItems: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.carousel.findMany({
			select: {
				id: true,
				alt: true,
				order: true,
			},
			orderBy: { order: 'asc' },
		});
	}),

	/**
	 * Full carousel data for public pages (hero carousel)
	 * Optimized select to only fetch needed fields for rendering
	 */
	getFullData: publicProcedure.query(async ({ ctx }) => {
		const allImages = await ctx.db.carousel.findMany({
			select: {
				id: true,
				alt: true,
				order: true,
				mobileSource: true,
				desktopSource: true,
			},
			orderBy: { order: 'asc' },
		});
		return { data: allImages };
	}),
	deleteItem: adminProcedure
		.input(z.object({ id: z.number().int().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const itemId = input.id;

			if (itemId === 1 || itemId === 2) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: `Carousel items with ID 1 and 2 are protected and cannot be deleted.`,
				});
			}
			const itemToDelete = await ctx.db.carousel.findUnique({
				where: { id: itemId },
				select: { mobileSource: true, desktopSource: true },
			});

			if (!itemToDelete) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Carousel item not found in DB.',
				});
			}

			const mobileKey = getKeyFromUrl(itemToDelete.mobileSource);
			const desktopKey = getKeyFromUrl(itemToDelete.desktopSource);

			try {
				const deletePromises: Promise<unknown>[] = [];

				if (mobileKey) {
					deletePromises.push(
						r2Client.send(
							new DeleteObjectCommand({
								Bucket: R2_BUCKET,
								Key: mobileKey,
							}),
						),
					);
				}
				if (desktopKey) {
					deletePromises.push(
						r2Client.send(
							new DeleteObjectCommand({
								Bucket: R2_BUCKET,
								Key: desktopKey,
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

			await ctx.db.carousel.delete({ where: { id: itemId } });

			return { success: true, itemId };
		}),
	createItem: adminProcedure
		.input(createItemInputSchema)
		.mutation(async ({ ctx, input }) => {
			let itemId: number | undefined;

			const latestOrderRecord = await ctx.db.carousel.findFirst({
				orderBy: { order: 'desc' },
				select: { order: true },
			});
			const finalOrder = (latestOrderRecord?.order ?? 0) + 1;

			try {
				const placeholderItem = await ctx.db.carousel.create({
					data: {
						alt: input.alt,
						order: finalOrder,
						mobileSource: 'R2_URL_PENDING',
						desktopSource: 'R2_URL_PENDING',
					},
				});
				itemId = placeholderItem.id;

				const [mobileSource, desktopSource] = await Promise.all([
					uploadToR2(input.mobileImage, itemId, 'mobile'),
					uploadToR2(input.pcImage, itemId, 'desktop'),
				]);

				const updatedCarouselItem = await ctx.db.carousel.update({
					where: { id: itemId },
					data: {
						mobileSource: mobileSource,
						desktopSource: desktopSource,
					},
				});

				return updatedCarouselItem;
			} catch (error) {
				console.error(error);

				if (itemId) {
					await ctx.db.carousel
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
