'use client';

import { useState, useCallback } from 'react';
import { useSession } from '~/lib/auth-client';
import { TRPCClientError } from '@trpc/client';

interface UseGameAuthResult {
	/** Whether the user is authenticated */
	isAuthenticated: boolean;
	/** Whether the session is still loading */
	isLoading: boolean;
	/** Whether the login prompt should be shown */
	showLoginPrompt: boolean;
	/** Whether the user has chosen to continue without logging in */
	hasDeclinedAuth: boolean;
	/** Show the login prompt */
	triggerLoginPrompt: () => void;
	/** Dismiss the login prompt and mark user as declined auth */
	dismissLoginPrompt: () => void;
	/**
	 * Checks if an error is an auth error (UNAUTHORIZED)
	 */
	isAuthError: (error: unknown) => boolean;
	/**
	 * Handles auth errors - shows login prompt only if user hasn't declined auth
	 * Returns true if the error was an auth error (so caller knows to suppress other error handling)
	 */
	handleAuthError: (error: unknown) => boolean;
}

/**
 * A custom hook for handling authentication state in game components.
 *
 * This hook provides:
 * - Authentication state (isAuthenticated, isLoading)
 * - Login prompt state management (showLoginPrompt, triggerLoginPrompt, dismissLoginPrompt)
 * - Tracking of whether user has declined to log in (hasDeclinedAuth)
 * - Error handling utilities for mutations that may fail due to auth
 *
 * Usage:
 * ```tsx
 * const { isAuthenticated, showLoginPrompt, dismissLoginPrompt, handleAuthError, hasDeclinedAuth } = useGameAuth();
 *
 * const mutation = api.game.addGuess.useMutation({
 *   onError: (error) => {
 *     if (!handleAuthError(error)) {
 *       toast.error(`Failed: ${error.message}`);
 *     }
 *   },
 * });
 *
 * if (showLoginPrompt) {
 *   return <LoginPrompt variant="modal" onDismiss={dismissLoginPrompt} />;
 * }
 * ```
 */
export function useGameAuth(): UseGameAuthResult {
	const { data: session, isPending } = useSession();
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const [hasDeclinedAuth, setHasDeclinedAuth] = useState(false);

	const isAuthenticated = !isPending && !!session;
	const isLoading = isPending;

	const triggerLoginPrompt = useCallback(() => {
		// Only show prompt if user hasn't already declined
		if (!hasDeclinedAuth) {
			setShowLoginPrompt(true);
		}
	}, [hasDeclinedAuth]);

	const dismissLoginPrompt = useCallback(() => {
		setShowLoginPrompt(false);
		setHasDeclinedAuth(true);
	}, []);

	const isAuthError = useCallback((error: unknown): boolean => {
		if (error instanceof TRPCClientError) {
			const data = error.data as { code?: string } | undefined;
			return data?.code === 'UNAUTHORIZED';
		}
		return false;
	}, []);

	const handleAuthError = useCallback(
		(error: unknown): boolean => {
			if (isAuthError(error)) {
				// Only show prompt if user hasn't declined auth
				if (!hasDeclinedAuth) {
					setShowLoginPrompt(true);
				}
				// Return true to indicate this was an auth error (suppress other error handling)
				return true;
			}
			return false;
		},
		[isAuthError, hasDeclinedAuth],
	);

	return {
		isAuthenticated,
		isLoading,
		showLoginPrompt,
		hasDeclinedAuth,
		triggerLoginPrompt,
		dismissLoginPrompt,
		isAuthError,
		handleAuthError,
	};
}
