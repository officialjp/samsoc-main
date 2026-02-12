import {
	adminProcedure,
	publicProcedure,
	createTRPCRouter,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { R2_BUCKET, R2_PUBLIC_URL, r2Client } from '~/server/r2-client';
import { type Prisma } from 'generated/prisma/client';
import { CACHE_STRATEGIES } from '~/server/api/helpers/cache';

const fileUploadSchema = z.object({
	base64: z.string().startsWith('data:'),
	fileName: z.string().min(1),
	mimeType: z.string().min(1),
});

const createItemInputSchema = z.object({
	title: z.string().min(1),
	author: z.string().min(1),
	volume: z.number().int().min(1),
	borrowed_by: z.string().optional(),
	sourceImage: fileUploadSchema,
});

const updateMangaInputSchema = z.object({
	id: z.number().int().min(1),
	title: z.string().min(1).optional(),
	author: z.string().min(1).optional(),
	volume: z.number().int().min(1).optional(),
	borrowed_by: z.string().optional().nullable(),
	newImage: fileUploadSchema.optional(),
});

async function deleteFromR2(url: string) {
	const key = getKeyFromUrl(url);
	if (key) {
		try {
			await r2Client.send(
				new DeleteObjectCommand({
					Bucket: R2_BUCKET,
					Key: key,
				}),
			);
		} catch (r2Error) {
			console.error(`R2 Deletion failed for key ${key}.`, r2Error);
		}
	}
}

async function uploadToR2(
	fileData: z.infer<typeof fileUploadSchema>,
	dbId: number,
	device: 'manga',
): Promise<string> {
	const { base64, fileName, mimeType } = fileData;

	const base64Data = base64.split(';base64,').pop();
	if (!base64Data) {
		throw new Error('Invalid base64 data received.');
	}

	const imageBuffer = Buffer.from(base64Data, 'base64');

	const key = `manga/${dbId}/${device}_${fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;

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

// Type helpers for manga queries with nested genres
const getLibraryPaginatedSelect = {
	id: true,
	title: true,
	author: true,
	volume: true,
	borrowed_by: true,
	source: true,
	genres: {
		select: {
			id: true,
			name: true,
		},
	},
} as const satisfies Prisma.MangaSelect;

// Extract return types
export type GetLibraryPaginatedItemResult = Prisma.MangaGetPayload<{
	select: {
		id: true;
		title: true;
		author: true;
		volume: true;
		borrowed_by: true;
		source: true;
		genres: {
			select: {
				id: true;
				name: true;
			};
		};
	};
}>;

export const mangaRouter = createTRPCRouter({
	getAllItems: adminProcedure.query(async ({ ctx }) => {
		return ctx.db.manga.findMany({
			select: {
				id: true,
				title: true,
				volume: true,
				author: true,
				borrowed_by: true,
				source: true,
			},
			orderBy: { id: 'asc' },
			cacheStrategy: CACHE_STRATEGIES.MODERATE,
		});
	}),

	/**
	 * Paginated query for library with server-side filtering.
	 * Uses offset-based pagination for page number support.
	 */
	getLibraryPaginated: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(12),
				page: z.number().min(1).default(1),
				status: z.enum(['all', 'available', 'borrowed']).default('all'),
				genre: z.string().optional(),
				search: z.string().optional(),
			}),
		)
		.query(
			async ({
				ctx,
				input,
			}): Promise<{
				items: GetLibraryPaginatedItemResult[];
				totalCount: number;
				totalPages: number;
				currentPage: number;
				hasMore: boolean;
			}> => {
				const { limit, page, status, genre, search } = input;

				// Build where clause based on filters
				const where: Prisma.MangaWhereInput = {};

				// Status filter
				if (status === 'available') {
					where.OR = [{ borrowed_by: null }, { borrowed_by: 'NULL' }];
				} else if (status === 'borrowed') {
					where.AND = [
						{ borrowed_by: { not: null } },
						{ borrowed_by: { not: 'NULL' } },
					];
				}

				// Genre filter
				if (genre && genre !== 'all') {
					where.genres = {
						some: {
							name: genre,
						},
					};
				}

				// Search filter (title or author)
				if (search && search.trim() !== '') {
					where.OR = [
						{ title: { contains: search, mode: 'insensitive' } },
						{ author: { contains: search, mode: 'insensitive' } },
					];
				}

				// Calculate offset for pagination
				const skip = (page - 1) * limit;

				// Fetch total count and paginated data in parallel
				const [totalCount, rawItems] = await Promise.all([
					ctx.db.manga.count({
						where,
						cacheStrategy: CACHE_STRATEGIES.MODERATE,
					}),
					ctx.db.manga.findMany({
						where,
						select: getLibraryPaginatedSelect,
						orderBy: { id: 'asc' },
						take: limit,
						skip: skip,
						cacheStrategy: CACHE_STRATEGIES.MODERATE,
					}),
				]);
				const items =
					rawItems as unknown as GetLibraryPaginatedItemResult[];

				const totalPages = Math.ceil(totalCount / limit);

				return {
					items,
					totalCount,
					totalPages,
					currentPage: page,
					hasMore: page < totalPages,
				};
			},
		),
	deleteItem: adminProcedure
		.input(z.object({ id: z.number().int().min(1) }))
		.mutation(async ({ ctx, input }) => {
			const itemId = input.id;

			const itemToDelete = await ctx.db.manga.findUnique({
				where: { id: itemId },
				select: { source: true },
			});

			if (!itemToDelete) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Manga item not found in DB.',
				});
			}

			const sourceKey = getKeyFromUrl(itemToDelete.source);

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

				await Promise.allSettled(deletePromises);
			} catch (r2Error) {
				console.error(
					`R2 Deletion failed for item ID ${itemId}. Proceeding to DB deletion.`,
					r2Error,
				);
			}

			await ctx.db.manga.delete({ where: { id: itemId } });

			return { success: true, itemId };
		}),
	createItem: adminProcedure
		.input(createItemInputSchema)
		.mutation(async ({ ctx, input }) => {
			let itemId: number | undefined;

			try {
				const placeholderItem = await ctx.db.manga.create({
					data: {
						title: input.title,
						author: input.author,
						volume: input.volume,
						borrowed_by: input.borrowed_by,
						source: 'R2_URL_PENDING',
					},
				});
				itemId = placeholderItem.id;

				const source = await uploadToR2(
					input.sourceImage,
					itemId,
					'manga',
				);

				const updatedMangaItem = await ctx.db.manga.update({
					where: { id: itemId },
					data: {
						source: source,
					},
				});

				return updatedMangaItem;
			} catch (error) {
				console.error(error);

				if (itemId) {
					await ctx.db.manga
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
						'Failed to create manga item or upload files. Database record was rolled back.',
					cause: error,
				});
			}
		}),
	updateManga: adminProcedure
		.input(updateMangaInputSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, title, author, volume, borrowed_by, newImage } = input;

			const currentManga = await ctx.db.manga.findUnique({
				where: { id },
			});

			if (!currentManga) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Manga not found.',
				});
			}

			const updateData: Prisma.MangaUpdateInput = {};

			if (title !== undefined) updateData.title = title;
			if (author !== undefined) updateData.author = author;
			if (volume !== undefined) updateData.volume = volume;

			if (borrowed_by !== undefined) {
				updateData.borrowed_by = borrowed_by ?? null;
			} else if (borrowed_by === null) {
				updateData.borrowed_by = null;
			}

			let newSourceUrl: string | undefined;

			if (newImage) {
				try {
					newSourceUrl = await uploadToR2(newImage, id, 'manga');
					updateData.source = newSourceUrl;
				} catch (error) {
					console.error(
						'R2 upload failed during updateManga:',
						error,
					);
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Failed to upload new image file.',
					});
				}
			}

			if (Object.keys(updateData).length === 0) {
				return currentManga;
			}

			const updatedManga = await ctx.db.manga.update({
				where: { id },
				data: updateData,
			});

			if (newImage && currentManga.source) {
				await deleteFromR2(currentManga.source);
			}

			return updatedManga;
		}),
});
