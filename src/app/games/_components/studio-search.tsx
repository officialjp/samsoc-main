'use client';

import { api } from '~/trpc/react';
import SearchInput from './search-input';

interface StudioItem {
	id: string; // The ID from TRPC (which was stringified from Int)
	name: string;
}

interface StudioSearchProps {
	onSelect: (selection: StudioItem) => void;
	disabled?: boolean;
}

export default function StudioSearch({
	onSelect,
	disabled,
}: StudioSearchProps) {
	const {
		data: studioData,
		isLoading,
		error,
	} = api.studio.getAllStudios.useQuery();

	return (
		<SearchInput
			items={studioData ?? []}
			searchKeys={[{ name: 'name' }]}
			onSelect={onSelect}
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
