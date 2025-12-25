import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function proxy(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// Check for protected routes
	const isProtectedPath =
		request.nextUrl.pathname.startsWith('/dashboard') ||
		request.nextUrl.pathname.startsWith('/admin');

	// If accessing protected route without session cookie, redirect to sign in
	// Note: This only checks cookie existence, not validity
	// Full validation should happen in the page/route handlers
	if (isProtectedPath && !sessionCookie) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*'],
};
