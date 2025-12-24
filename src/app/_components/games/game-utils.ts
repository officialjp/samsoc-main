import type { MatchResult } from '~/lib/game-types';
import type { DisplayFieldKey } from '~/lib/game-config';
import { ARRAY_FIELDS } from '~/lib/game-config';

type ArrayFieldKey = (typeof ARRAY_FIELDS)[number];

/**
 * Formats a value for display
 */
export function formatDisplayValue(value: unknown): string {
	if (value === null || value === undefined) return '—';
	if (Array.isArray(value))
		return value.map((v) => formatDisplayValue(v)).join(', ');
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	) {
		return String(value);
	}
	return '—';
}

/**
 * Checks if a value is empty
 */
export function isEmpty(val: unknown): boolean {
	if (val === null || val === undefined) return true;
	if (typeof val === 'string' && val.trim() === '') return true;
	if (Array.isArray(val) && val.length === 0) return true;
	return false;
}

/**
 * Parses a value to an array of strings
 */
export function parseToArray(val: unknown): string[] {
	if (isEmpty(val)) return [];
	if (Array.isArray(val)) {
		return val
			.map((v) => formatDisplayValue(v).toLowerCase().trim())
			.filter((s) => s && s !== '—');
	}
	const str = formatDisplayValue(val);
	if (str === '—') return [];
	return str
		.split(',')
		.map((s) => s.toLowerCase().trim())
		.filter((s) => s);
}

/**
 * Checks if a field key is an array field
 */
export function isArrayField(fieldKey: DisplayFieldKey): fieldKey is ArrayFieldKey {
	return ARRAY_FIELDS.includes(fieldKey as ArrayFieldKey);
}

/**
 * Checks field match between target and guess values
 */
export function checkFieldMatch(
	targetValue: unknown,
	guessValue: unknown,
	fieldKey?: DisplayFieldKey,
): MatchResult {
	const isArrayFieldType = fieldKey && isArrayField(fieldKey);

	const targetEmpty = isEmpty(targetValue);
	const guessEmpty = isEmpty(guessValue);

	// Both empty - exact match
	if (targetEmpty && guessEmpty) return 'exact';

	// Target empty but guess has value - unknown (can't compare)
	if (targetEmpty) return 'unknown';

	// Target has value but guess is empty - no match
	if (guessEmpty) return 'none';

	// For array fields, check for partial matches
	if (isArrayFieldType) {
		const targetArr = parseToArray(targetValue);
		const guessArr = parseToArray(guessValue);

		if (targetArr.length === 0 && guessArr.length === 0) return 'exact';
		if (targetArr.length === 0) return 'unknown';
		if (guessArr.length === 0) return 'none';

		const targetSet = new Set(targetArr);
		const guessSet = new Set(guessArr);

		const matchCount = guessArr.filter((item) => targetSet.has(item)).length;

		// Exact match: same items (all match and same count)
		if (targetSet.size === guessSet.size && matchCount === targetSet.size) {
			return 'exact';
		}

		// Partial match: some items overlap
		if (matchCount > 0) {
			return 'partial';
		}

		return 'none';
	}

	// For non-array fields, only exact or no match
	const tStr = formatDisplayValue(targetValue).toLowerCase().trim();
	const gStr = formatDisplayValue(guessValue).toLowerCase().trim();

	if (tStr === gStr && tStr !== '—') {
		return 'exact';
	}

	return 'none';
}

/**
 * Gets the background color class for a match result
 */
export function getMatchResultBgColor(result: MatchResult): string {
	switch (result) {
		case 'exact':
			return 'bg-green-100';
		case 'partial':
			return 'bg-yellow-100';
		case 'none':
			return 'bg-red-100';
		case 'unknown':
			return 'bg-gray-100';
		default:
			return 'bg-white';
	}
}

/**
 * Gets the text color class for a match result
 */
export function getMatchResultTextColor(result: MatchResult): string {
	switch (result) {
		case 'exact':
			return 'text-green-600';
		case 'partial':
			return 'text-yellow-600';
		case 'none':
			return 'text-red-600';
		case 'unknown':
			return 'text-gray-500';
		default:
			return 'text-gray-900';
	}
}

/**
 * Gets the progress bar color class for a match result
 */
export function getMatchResultForProgress(result: MatchResult): string {
	switch (result) {
		case 'exact':
			return 'bg-green-500';
		case 'partial':
			return 'bg-yellow-500';
		case 'unknown':
			return 'bg-gray-400';
		default:
			return 'bg-red-400';
	}
}

