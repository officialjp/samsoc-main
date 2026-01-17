import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { generateMissingSchedules } from '~/server/api/helpers/auto-schedule';

/**
 * Cron endpoint for generating daily game schedules
 *
 * This endpoint is called by Vercel Cron at midnight UTC daily.
 * It checks if schedules exist for today (in London time) and creates them if missing.
 *
 * Security: Requires CRON_SECRET in the Authorization header.
 *
 * Games scheduled:
 * - AnimeWordle: Random anime with popularity <= 1500
 * - StudioGuessr: Random studio with at least one anime in top 1500 popularity
 * - Zoomed-In Banner: Random anime with popularity <= 1500 and valid image
 *
 * All games avoid repeating anime/studios from the last 7 days (with fallback).
 */
export async function GET(request: Request) {
	try {
		// Verify authorization
		const authHeader = request.headers.get('authorization');
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (!process.env.CRON_SECRET) {
			console.error('[Cron] CRON_SECRET environment variable is not set');
			return NextResponse.json(
				{ error: 'Server configuration error: CRON_SECRET not set' },
				{ status: 500 },
			);
		}

		if (authHeader !== expectedAuth) {
			console.warn(
				'[Cron] Unauthorized access attempt to daily-schedule cron',
			);
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		console.log('[Cron] Starting daily schedule generation...');

		// Generate missing schedules
		const results = await generateMissingSchedules(db);

		console.log(
			'[Cron] Daily schedule generation completed:',
			JSON.stringify(results, null, 2),
		);

		return NextResponse.json(results, { status: 200 });
	} catch (error) {
		console.error('[Cron] Error generating daily schedules:', error);

		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error';

		return NextResponse.json(
			{
				error: 'Failed to generate daily schedules',
				details: errorMessage,
			},
			{ status: 500 },
		);
	}
}
