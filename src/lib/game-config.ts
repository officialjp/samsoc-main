/**
 * Game configuration constants
 * Centralized location for all game rules and settings
 */

export const GAME_CONFIG = {
  WORDLE: {
    MAX_GUESSES: 16,
    NAME: 'Anime Wordle',
  } as const,
  STUDIO: {
    MAX_GUESSES: 5,
    NAME: 'Studio Guesser',
  } as const,
  BANNER: {
    MAX_GUESSES: 6,
    NAME: 'Zoomed-In Banner',
  } as const,
} as const;

export const HINT_LABELS = [
  'Average Rating',
  'First & Last Anime Year',
  'Top 5 Most Adapted Genres',
  '10 Notable Characters',
  '5 Notable Shows',
] as const;

export const REVEAL_SIZES = [15, 30, 45, 65, 85, 100] as const;

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

/**
 * Wordle hint system configuration
 * Hints unlock progressively in multiples of 4 guesses
 */
export const WORDLE_HINT_CONFIG = {
  DESCRIPTION_THRESHOLD: 4, // Show description at 4 guesses
  CHARACTERS_THRESHOLD: 8, // Show characters at 8 guesses
  BLURRED_IMAGE_THRESHOLD: 12, // Show blurred image at 12 guesses
  UNBLURRED_IMAGE_THRESHOLD: 16, // Show unblurred image at 16 guesses (game over)
  CHARACTER_COUNT: 3, // Number of characters to display
  BLUR_AMOUNT: 3, // CSS blur pixels for blurred state
  DESCRIPTION_PREVIEW_LENGTH: 100, // Characters to show before collapse
} as const;
