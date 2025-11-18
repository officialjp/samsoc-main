// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
	}); //test

	const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
	const isAdmin = req.nextUrl.pathname.startsWith('/admin');

	if (isDashboard || isAdmin) {
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
