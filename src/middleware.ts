import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const secretValue = process.env.AUTH_SECRET;
	console.log('--- DEBUG COOKIES ---');
	console.log('Environment:', process.env.NODE_ENV);
	req.cookies.getAll().forEach((c) => {
		console.log(`Cookie: ${c.name}`);
	});
	console.log('---------------------');
	console.log('AUTH_SECRET is set:', !!secretValue);
	const token = await getToken({
		req,
		secret: secretValue,
	});

	console.log('Token in Middleware:', token);

	const isProtectedPath =
		req.nextUrl.pathname.startsWith('/dashboard') ||
		req.nextUrl.pathname.startsWith('/admin');

	if (isProtectedPath) {
		if (!token) {
			console.log('Token is NULL, Redirecting to signin');
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
