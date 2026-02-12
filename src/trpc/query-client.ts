import {
	defaultShouldDehydrateQuery,
	QueryClient,
} from '@tanstack/react-query';
import SuperJSON from 'superjson';

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 30 * 1000,
				// Disable automatic refetch on window focus — data should only
				// refresh when explicitly invalidated (e.g. after mutations).
				// This prevents dashboard editor forms from resetting mid-edit
				// when the admin switches browser tabs.
				refetchOnWindowFocus: false,
			},
			dehydrate: {
				serializeData: SuperJSON.serialize,
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === 'pending',
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize,
			},
		},
	});
