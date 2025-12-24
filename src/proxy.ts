import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAuthSecret } from '~/lib/auth-secret';

export async function proxy(req: NextRequest) {
	const isProtectedPath =
		req.nextUrl.pathname.startsWith('/dashboard') ||
		req.nextUrl.pathname.startsWith('/admin');

	if (!isProtectedPath) {
		return NextResponse.next();
	}

	// Get the secret from environment (shared utility ensures consistency)
	const secretValue = getAuthSecret();

	try {
		const token = await getToken({
			req,
			secret: secretValue,
		});

		if (!token) {
			return NextResponse.redirect(new URL('/api/auth/signin', req.url));
		}

		const userRole = token.role;
		if (userRole !== 'admin') {
			return NextResponse.redirect(new URL('/unauthorized', req.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Token verification error:', error);
		return NextResponse.redirect(new URL('/api/auth/signin', req.url));
	}
}

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*'],
};
