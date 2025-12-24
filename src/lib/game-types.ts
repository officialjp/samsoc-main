import type { DISPLAY_FIELDS, DisplayFieldKey, ARRAY_FIELDS } from './game-config';

/**
 * Type for Wordle guess data - matches the structure of DISPLAY_FIELDS
 */
export type WordleGuessData = {
	[K in DisplayFieldKey]: unknown;
};

/**
 * Match result types for field comparison
 */
export type MatchResult = 'exact' | 'partial' | 'none' | 'unknown';

/**
 * Display field structure
 */
export type DisplayField = {
	key: DisplayFieldKey;
	label: string;
};

/**
 * Array field keys
 */
export type ArrayFieldKey = (typeof ARRAY_FIELDS)[number];

/**
 * Anime data structure for wordle game
 */
export interface AnimeWordleData {
	id: number;
	title: string;
	releasedYear: number | null;
	releasedSeason: string | null;
	genres: string | null;
	themes: string | null;
	studios: string | null;
	source: string | null;
	score: number | null;
}

/**
 * Studio data structure for studio game
 */
export interface StudioGameData {
	id: string;
	name: string;
	avgRating: number;
	firstAnimeYear: number;
	lastAnimeYear: number;
	topGenres: string[];
	characters: string[];
	animeList: string[];
}

