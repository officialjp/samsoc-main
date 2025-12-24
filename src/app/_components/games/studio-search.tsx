'use client';

import { api } from '~/trpc/react';
import SearchInput from './search-input';

interface StudioItem {
	id: string; // This is the studio name string
	name: string;
}

interface StudioSearchProps {
	onSelect: (studioId: string) => void;
	disabled?: boolean;
}

export default function StudioSearch({
	onSelect,
	disabled,
}: StudioSearchProps) {
	// Fetch unique studios from our refactored tRPC call
	const { data: studioData, isLoading, error } =
		api.studio.getAllStudios.useQuery();

	const handleSelect = (studio: StudioItem): void => {
		onSelect(studio.id); // Passes the studio name string up
	};

	return (
		<SearchInput
			items={studioData ?? []}
			searchKeys={[{ name: 'name' }]}
			onSelect={handleSelect}
			placeholder="Search for a studio (e.g. Mappa, Madhouse)..."
			disabled={disabled}
			loading={isLoading}
			error={error?.message ?? null}
			getItemId={(item) => item.id}
			renderItem={(studio) => (
				<div className="font-bold text-gray-900">{studio.name}</div>
			)}
		/>
	);
}
