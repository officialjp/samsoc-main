'use server';

import { revalidatePath } from 'next/cache';

/**
 * Server actions for on-demand cache revalidation.
 * Call these after dashboard mutations to instantly update public pages.
 *
 * Note: This revalidates the Next.js Full Route Cache.
 * Prisma Accelerate cache is separate and uses TTL-based expiration.
 */

/**
 * Revalidates the home page (carousel, committee, anime cards)
 */
export async function revalidateHomePage() {
	revalidatePath('/');
}

/**
 * Revalidates the calendar page (events)
 */
export async function revalidateCalendarPage() {
	revalidatePath('/calendar');
}

/**
 * Revalidates the gallery page (images)
 */
export async function revalidateGalleryPage() {
	revalidatePath('/gallery');
}

/**
 * Revalidates the library page (manga)
 */
export async function revalidateLibraryPage() {
	revalidatePath('/library');
}

/**
 * Revalidates multiple pages at once
 */
export async function revalidatePages(
	pages: ('home' | 'calendar' | 'gallery' | 'library')[],
) {
	const pathMap = {
		home: '/',
		calendar: '/calendar',
		gallery: '/gallery',
		library: '/library',
	} as const;

	for (const page of pages) {
		revalidatePath(pathMap[page]);
	}
}
