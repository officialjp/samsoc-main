'use client';

import type { MatchResult } from '~/lib/game-types';
import {
	formatDisplayValue,
	parseToArray,
	getMatchResultBgColor,
	getMatchResultTextColor,
} from './game-utils';
import { ARRAY_FIELDS, type DisplayFieldKey } from '~/lib/game-config';

interface FieldCellProps {
	label: string;
	value: unknown;
	matchResult?: MatchResult;
	targetValue?: unknown;
	fieldKey?: DisplayFieldKey;
}

export default function FieldCell({
	label,
	value,
	matchResult,
	targetValue,
	fieldKey,
}: FieldCellProps) {
	const bgColor = matchResult
		? getMatchResultBgColor(matchResult)
		: 'bg-white';

	const showArrow =
		matchResult === 'none' &&
		targetValue !== undefined &&
		(label === 'Year' || label === 'Score');
	let arrowDirection: 'up' | 'down' | null = null;

	if (showArrow) {
		const targetNum = Number(targetValue);
		const guessNum = Number(value);
		if (!isNaN(targetNum) && !isNaN(guessNum))
			arrowDirection = guessNum < targetNum ? 'up' : 'down';
	}

	const renderColorCodedValue = () => {
		const isArrayField = fieldKey && ARRAY_FIELDS.includes(fieldKey);

		if (isArrayField && targetValue !== undefined) {
			const targetArr = parseToArray(targetValue);

			// If target is empty, show gray text
			if (targetArr.length === 0) {
				return (
					<div className="text-sm font-semibold text-gray-500 wrap-break-word">
						{formatDisplayValue(value)}
					</div>
				);
			}

			const targetSet = new Set(targetArr);

			// Get the original display values (not lowercased)
			const displayArray = Array.isArray(value)
				? value
				: formatDisplayValue(value)
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s && s !== '—');

			return (
				<div className="text-sm font-semibold wrap-break-word">
					{displayArray.map((item, idx) => {
						const itemStr =
							typeof item === 'string'
								? item
								: formatDisplayValue(item);
						const itemMatch = targetSet.has(
							itemStr.toLowerCase().trim(),
						);

						return (
							<span key={idx}>
								<span
									className={
										itemMatch
											? 'text-green-600'
											: 'text-red-600'
									}
								>
									{itemStr.trim()}
								</span>
								{idx < displayArray.length - 1 && ', '}
							</span>
						);
					})}
				</div>
			);
		}

		if (matchResult !== undefined) {
			const textColor = getMatchResultTextColor(matchResult);
			return (
				<div
					className={`text-sm font-semibold ${textColor} wrap-break-word`}
				>
					{formatDisplayValue(value)}
				</div>
			);
		}

		return (
			<div className="text-sm font-semibold text-gray-900 wrap-break-word">
				{formatDisplayValue(value)}
			</div>
		);
	};

	return (
		<div
			className={`${bgColor} border-2 border-black rounded-lg p-4 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] min-h-[100px] flex flex-col justify-center relative`}
			role="gridcell"
			aria-label={`${label}: ${formatDisplayValue(value)}`}
		>
			<div className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
				{label}
			</div>
			{renderColorCodedValue()}
			{arrowDirection && (
				<div
					className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-6xl font-bold"
					aria-label={`${arrowDirection === 'up' ? 'Higher' : 'Lower'} than answer`}
				>
					{arrowDirection === 'up' ? '↑' : '↓'}
				</div>
			)}
		</div>
	);
}
