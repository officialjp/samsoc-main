'use client';

import { api } from '~/trpc/react';
import GenericItemRemoval from '../generalized/generic-item-removal';
import { toast } from 'sonner';

interface MangaItem {
	id: number;
	title: string;
	volume: number;
}

export default function MangaRemove() {
	const { data: items, isLoading } = api.manga.getAllItems.useQuery();

	const deleteMutation = api.manga.deleteItem.useMutation({
		onSuccess: (_, variables) => {
			toast.success(
				`Item ID ${variables.id} successfully deleted (R2 files cleaned up).`,
			);
		},
		onError: (error) => {
			toast.error(`Deletion failed: ${error.message}`);
		},
	});

	const handleDelete = (id: number) => {
		deleteMutation.mutate({ id });
	};

	const getItemLabel = (item: MangaItem): string => {
		return `ID: ${item.id} VOLUME: ${item.volume} - "${item.title.substring(0, 30)}${item.title.length > 30 ? '...' : ''}"`;
	};

	const getSearchableFields = (item: MangaItem): string[] => {
		return [String(item.id), item.title, String(item.volume)];
	};

	return (
		<GenericItemRemoval<MangaItem>
			title="Remove Manga Item"
			items={items}
			isLoading={isLoading}
			isSubmitting={deleteMutation.isPending}
			onDelete={handleDelete}
			getItemLabel={getItemLabel}
			getSearchableFields={getSearchableFields}
			searchPlaceholder="Search by ID, Title, or Volume..."
			useWindowConfirm={true}
			confirmationMessage={(id) =>
				`Are you sure you want to permanently delete item ID ${id}? This action cannot be undone and will delete files from R2.`
			}
		/>
	);
}
