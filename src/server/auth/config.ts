import { PrismaAdapter } from '@auth/prisma-adapter';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import type { Adapter } from 'next-auth/adapters';

import { db } from '~/server/db';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: string;
		} & DefaultSession['user'];
	}

	interface User {
		role: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: string;
	}
}

// Ensure AUTH_SECRET is set, with a development default if missing
function getAuthSecret() {
	let secret = process.env.AUTH_SECRET;

	if (!secret && process.env.NODE_ENV === 'development') {
		secret = 'development-secret-key-change-in-production';
	}

	return secret;
}

export const authConfig = {
	providers: [DiscordProvider],
	adapter: PrismaAdapter(db) as Adapter,
	session: {
		strategy: 'jwt',
	},
	secret: getAuthSecret(),
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user?.id) {
				token.id = user.id;
				if (
					'role' in user &&
					typeof user.role === 'string' &&
					user.role
				) {
					token.role = user.role;
				} else {
					const dbUser = await db.user.findUnique({
						where: { id: user.id },
						select: { role: true },
					});
					token.role = dbUser?.role ?? 'user';
				}
			}

			if (!token.role && token.id) {
				const dbUser = await db.user.findUnique({
					where: { id: token.id },
					select: { role: true },
				});
				token.role = dbUser?.role ?? 'user';
			}

			return token;
		},
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					role: token.role,
				},
			};
		},
	},
} satisfies NextAuthConfig;
