import { PrismaAdapter } from '@auth/prisma-adapter';
import { type DefaultSession, type NextAuthConfig } from 'next-auth';
import type { Session } from 'next-auth';
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

export const authConfig = {
	providers: [DiscordProvider],
	adapter: PrismaAdapter(db) as Adapter,
	session: {
		strategy: 'jwt',
	},
	cookies: {
		sessionToken: {
			name: 'next-auth.session-token',
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: true,
				domain: '.samsoc.co.uk',
			},
		},
	},
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id!;
				token.role = (user as { role?: string }).role ?? 'user';
			}
			if (!token.role && token.id) {
				const dbUser = await db.user.findUnique({
					where: {
						id: token.id as string,
					},
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
					id: typeof token.id === 'string' ? token.id : '',
					role: typeof token.role === 'string' ? token.role : 'user',
				},
			} as Session;
		},
	},
} satisfies NextAuthConfig;
