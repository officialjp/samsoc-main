import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const secretValue = process.env.AUTH_SECRET;
	const cookieName = process.env.SECURE_KEY_NAME;

	const token = await getToken({
		req,
		secret: secretValue,
		cookieName: cookieName ?? '__Secure-authjs.session-token',
	});

	const isProtectedPath =
		req.nextUrl.pathname.startsWith('/dashboard') ||
		req.nextUrl.pathname.startsWith('/admin');

	if (isProtectedPath) {
		if (!token) {
			return NextResponse.redirect(new URL('/api/auth/signin', req.url));
		}
		if (token.role !== 'admin') {
			return NextResponse.redirect(new URL('/unauthorized', req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*'],
};
