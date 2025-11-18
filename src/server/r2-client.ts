import { S3Client } from '@aws-sdk/client-s3';

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN;

if (
	!R2_ENDPOINT ||
	!R2_ACCESS_KEY_ID ||
	!R2_SECRET_ACCESS_KEY ||
	!R2_PUBLIC_DOMAIN
) {
	throw new Error('R2 environment variables are not fully configured.');
}

export const R2_PUBLIC_URL = R2_PUBLIC_DOMAIN;

const s3Client = new S3Client({
	endpoint: R2_ENDPOINT,
	region: 'auto',
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
});

export const r2Client = s3Client;
export const R2_BUCKET = R2_BUCKET_NAME;
