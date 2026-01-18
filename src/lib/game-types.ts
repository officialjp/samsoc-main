import type { DisplayFieldKey, ARRAY_FIELDS } from './game-config';

/**
 * Type for Wordle guess data - matches the structure of DISPLAY_FIELDS
 */
export type WordleGuessData = Record<DisplayFieldKey, unknown>;

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

/**
 * Game types enum (matches Prisma GameType and GAME_TYPES constant)
 */
export type GameType = 'wordle' | 'studio' | 'banner';

/**
 * Leaderboard user entry
 */
export interface LeaderboardUser {
	id: string;
	name: string | null;
	image?: string | null;
	wins: number;
	totalTries: number;
}

/**
 * Leaderboard entry from API (flattened format)
 */
export interface LeaderboardEntry {
	id: string;
	name: string | null;
	image: string | null;
	wins: number;
	totalTries: number;
}

/**
 * Guess data formats for each game type stored in GameGuess.guessData (Json field)
 */
export type WordleGuessDataPayload = WordleGuessData;

export interface BannerGuessDataPayload {
	animeId: number;
	animeTitle?: string;
}

export interface StudioGuessDataPayload {
	studioName: string;
}

/**
 * Union type for all guess data payloads
 */
export type GuessDataPayload =
	| WordleGuessDataPayload
	| BannerGuessDataPayload
	| StudioGuessDataPayload;

/**
 * Consolidated game guess
 */
export interface GameGuess {
	id: string;
	sessionId: string;
	guessData: GuessDataPayload;
	createdAt: Date;
}

/**
 * Banner guess type with anime title (for display purposes)
 */
export interface BannerGuess {
	id: string;
	sessionId: string;
	animeId: number;
	animeTitle: string;
	createdAt: Date;
}

/**
 * Studio guess type (for display purposes)
 */
export interface StudioGuess {
	id: string;
	sessionId: string;
	studioName: string;
	createdAt: Date;
}

/**
 * Consolidated game session
 */
export interface GameSession {
	id: string;
	userId: string;
	gameType: GameType;
	date: Date;
	targetId: string; // animeId (as string) for wordle/banner, studioName for studio
	won: boolean;
	failed: boolean;
	createdAt: Date;
	updatedAt: Date;
	guesses: GameGuess[];
}

/**
 * Game answer data returned from API
 */
export interface GameAnswerData<T> {
	anime?: T;
	studio?: T;
	hasWonToday: boolean;
	hasFailedToday: boolean;
}

/**
 * Character entry structure from database
 */
export interface CharacterEntry {
	name: string;
	role?: string;
}

/**
 * Wordle hint data for progressive hints
 */
export interface WordleHintData {
	title: string | null;
	description: string | null;
	characters: CharacterEntry[] | null;
	image: string | null;
}

/**
 * Answer anime for wordle game
 */
export interface WordleAnswerAnime {
	id: number;
	title: string;
	releasedYear: number | null;
	releasedSeason: string | null;
	genres: string | null;
	themes: string | null;
	studios: string | null;
	source: string | null;
	score: number | null;
	// Hint-related fields
	description?: string | null;
	characters?: CharacterEntry[] | null;
	image?: string | null;
}

/**
 * Answer anime for banner game
 */
export interface BannerAnswerAnime {
	id: number;
	title: string;
	image: string | null;
}

/**
 * Game statistics for a user
 */
export interface GameStats {
	id: string;
	userId: string;
	gameType: GameType;
	wins: number;
	lastWonAt: Date | null;
	totalTries: number;
	dailyGuesses: number;
	lastGuessAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Daily schedule entry
 */
export interface DailySchedule {
	id: number;
	date: Date;
	gameType: GameType;
	animeId: number | null;
	studioId: number | null;
}

/**
 * Props for game components
 */
export interface GameComponentProps {
	gameWon: boolean;
	setGameWon: (won: boolean) => void;
	setGameFailed: (failed: boolean) => void;
}

/**
 * Props for wordle component
 */
export interface AnimeWordleProps extends GameComponentProps {
	searchedAnimeId: string | undefined;
}

/**
 * Props for studio game component
 */
export interface StudioGameProps extends GameComponentProps {
	selectedStudioId: string | undefined;
}

/**
 * Helper type guards for guess data payloads
 */
export function isWordleGuessData(
	data: GuessDataPayload,
): data is WordleGuessDataPayload {
	return !('animeId' in data) && !('studioName' in data);
}

export function isBannerGuessData(
	data: GuessDataPayload,
): data is BannerGuessDataPayload {
	return 'animeId' in data && !('studioName' in data);
}

export function isStudioGuessData(
	data: GuessDataPayload,
): data is StudioGuessDataPayload {
	return 'studioName' in data;
}
