import { auth } from '~/server/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
	const isAuthenticated = !!req.auth;
	const isAdminOnlyRoute =
		req.nextUrl.pathname.startsWith('/admin') ||
		req.nextUrl.pathname.startsWith('/dashboard');

	if (isAdminOnlyRoute) {
		if (!isAuthenticated) {
			return NextResponse.redirect(new URL('/api/auth/signin', req.url));
		}

		if (req.auth?.user.role !== 'admin') {
			return NextResponse.redirect(new URL('/unauthorized', req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*'],
};
