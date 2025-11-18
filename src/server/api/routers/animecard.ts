import {
	publicProcedure,
	createTRPCRouter,
	adminProcedure,
} from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';
import * as z from 'zod';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Prisma } from '@prisma/client';
const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN!;

const s3Client = new S3Client({
	endpoint: R2_ENDPOINT,
	region: 'auto',
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

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

	const base64Parts = base64.split(';base64,');

	if (base64Parts.length !== 2) {
		throw new Error('Invalid base64 data received (missing prefix).');
	}

	const base64Data = base64Parts[1];

	if (!base64Data) {
		throw new Error('Failed to extract base64 data payload.');
	}

	const imageBuffer = Buffer.from(base64Data, 'base64');

	const safeFileName = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
	const key = `animeCards/${dbId}/${safeFileName}`;

	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
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

	return `${R2_PUBLIC_DOMAIN}/${key}`;
}

async function deleteFromR2(url: string | undefined): Promise<void> {
	if (!url || !R2_PUBLIC_DOMAIN || !url.startsWith(R2_PUBLIC_DOMAIN)) {
		return;
	}

	const key = url.substring(R2_PUBLIC_DOMAIN.length + 1);

	if (!key || key.includes('/placeholder.svg')) {
		return;
	}

	try {
		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
			}),
		);
	} catch (error) {
		console.error(`Failed to delete R2 object with key: ${key}`, error);
	}
}

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
	studio: z.string().optional(),
	newImage: fileUploadSchema.optional(),
});

export const animeCardsRouter = createTRPCRouter({
	getAllCards: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.animeCard.findMany({
			orderBy: { id: 'asc' },
		});
	}),

	updateCard: adminProcedure
		.input(updateAnimeCardInputSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, newImage, ...dataToUpdate } = input;

			const updateData: Prisma.AnimeCardUpdateInput = {
				...dataToUpdate,
			};

			let oldSourceUrl: string | undefined;

			if (newImage) {
				const currentCard = await ctx.db.animeCard.findUnique({
					where: { id },
					select: { source: true },
				});

				if (!currentCard) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'AnimeCard not found.',
					});
				}

				oldSourceUrl = currentCard.source;

				const newSourceUrl = await uploadToR2(newImage, id);

				updateData.source = newSourceUrl;
			}

			const updatedCard = await ctx.db.animeCard.update({
				where: { id },
				data: updateData,
			});

			if (
				newImage &&
				oldSourceUrl &&
				oldSourceUrl.startsWith(R2_PUBLIC_DOMAIN!)
			) {
				await deleteFromR2(oldSourceUrl);
			}

			return updatedCard;
		}),
});
