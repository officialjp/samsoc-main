'use client';

import { api } from '~/trpc/react';
import { revalidateGalleryPage } from '~/server/actions/revalidate';
import GenericItemRemoval from '../../_components/generic-item-removal';
import { toast } from 'sonner';

interface ImageItem {
	id: number;
	alt: string;
}

export default function ImageRemove() {
	const { data: items, isLoading } = api.image.getAllItems.useQuery();

	const utils = api.useUtils();
	const deleteMutation = api.image.deleteItem.useMutation({
		onSuccess: (_, variables) => {
			void utils.image.getAllItems.invalidate();
			void revalidateGalleryPage();
			toast.success(
				`Image ID ${variables.id} successfully deleted (R2 files cleaned up).`,
			);
		},
		onError: (error) => {
			toast.error(`Deletion failed: ${error.message}`);
		},
	});

	const handleDelete = (id: number) => {
		deleteMutation.mutate({ id });
	};

	const getItemLabel = (item: ImageItem): string => {
		return `ID: ${item.id} - "${item.alt.substring(0, 30)}${item.alt.length > 30 ? '...' : ''}"`;
	};

	const getSearchableFields = (item: ImageItem): string[] => {
		return [String(item.id), item.alt];
	};

	return (
		<GenericItemRemoval<ImageItem>
			title="Remove Image Item"
			items={items}
			isLoading={isLoading}
			isSubmitting={deleteMutation.isPending}
			onDelete={handleDelete}
			getItemLabel={getItemLabel}
			getSearchableFields={getSearchableFields}
			searchPlaceholder="Search by ID or Alt text..."
			useWindowConfirm={true}
			confirmationMessage={(id) =>
				`Are you sure you want to permanently delete item ID ${id}? This action cannot be undone and will delete files from R2.`
			}
		/>
	);
}
