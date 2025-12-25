import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { db } from '~/server/db';

export const auth = betterAuth({
	database: prismaAdapter(db, {
		provider: 'postgresql',
	}),
	socialProviders: {
		discord: {
			clientId: process.env.AUTH_DISCORD_ID!,
			clientSecret: process.env.AUTH_DISCORD_SECRET!,
		},
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false, // Don't allow users to set their own role
			},
		},
	},
	plugins: [
		admin({
			defaultRole: 'user',
			adminRoles: ['admin'],
		}),
		nextCookies(), // Must be last plugin
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	trustedOrigins: [process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'],
});

export type Session = typeof auth.$Infer.Session;
