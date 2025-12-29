import { env } from '~/env';
import { withAccelerate } from '@prisma/extension-accelerate';
// Path: relative from 'server/db.ts' to root 'generated/prisma'
import { PrismaClient } from 'generated/prisma/client';

const createPrismaClient = () => {
	return new PrismaClient({
		// Required for Prisma 7 + Accelerate
		accelerateUrl: env.DATABASE_URL,
		log:
			env.NODE_ENV === 'development'
				? ['query', 'error', 'warn']
				: ['error'],
	}).$extends(withAccelerate());
};

// Properly type the extended client for the global object
type PrismaClientWithAccelerate = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientWithAccelerate | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
