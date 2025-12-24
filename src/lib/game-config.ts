/**
 * Game configuration constants
 * Centralized location for all game rules and settings
 */

export const GAME_CONFIG = {
	WORDLE: {
		MAX_GUESSES: 12,
		NAME: 'Anime Wordle',
	} as const,
	STUDIO: {
		MAX_GUESSES: 5,
		NAME: 'Studio Guesser',
	} as const,
	BANNER: {
		MAX_GUESSES: 5,
		NAME: 'Zoomed-In Banner',
	} as const,
} as const;

export const BANNER_ZOOM_LEVELS = [
	0.15, // 15% zoom - most zoomed in
	0.25,
	0.4,
	0.6,
	1.0, // 100% zoom - full image
] as const;

export const HINT_LABELS = [
	'Average Rating',
	'First & Last Anime Year',
	'Top 5 Most Adapted Genres',
	'10 Notable Characters',
	'5 Notable Shows',
] as const;

export const DISPLAY_FIELDS = [
	{ key: 'title', label: 'Title' },
	{ key: 'releasedYear', label: 'Year' },
	{ key: 'genres', label: 'Genres' },
	{ key: 'releasedSeason', label: 'Season' },
	{ key: 'themes', label: 'Themes' },
	{ key: 'studios', label: 'Studios' },
	{ key: 'source', label: 'Source' },
	{ key: 'score', label: 'Score' },
] as const;

export type DisplayFieldKey = (typeof DISPLAY_FIELDS)[number]['key'];

export const ARRAY_FIELDS: DisplayFieldKey[] = ['genres', 'themes', 'studios'];
