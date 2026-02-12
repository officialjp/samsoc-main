'use client';

import { api } from '~/trpc/react';
import GenericItemRemoval from '../../_components/generic-item-removal';
import { toast } from 'sonner';

interface CarouselItem {
	id: number;
	alt: string;
	order: number;
}

export default function CarouselRemove() {
	const { data: items, isLoading } = api.carousel.getAllItems.useQuery();

	const utils = api.useUtils();
	const deleteMutation = api.carousel.deleteItem.useMutation({
		onSuccess: (_, variables) => {
			void utils.carousel.getAllItems.invalidate();
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

	const getItemLabel = (item: CarouselItem): string => {
		return `ID: ${item.id} (Order: ${item.order}) - "${item.alt.substring(0, 30)}${item.alt.length > 30 ? '...' : ''}"`;
	};

	const getSearchableFields = (item: CarouselItem): string[] => {
		return [String(item.id), String(item.order), item.alt];
	};

	return (
		<GenericItemRemoval<CarouselItem>
			title="Remove Carousel Item"
			items={items}
			isLoading={isLoading}
			isSubmitting={deleteMutation.isPending}
			onDelete={handleDelete}
			getItemLabel={getItemLabel}
			getSearchableFields={getSearchableFields}
			searchPlaceholder="Search by ID, Order, or Alt text..."
			useWindowConfirm={true}
			protectedIds={[1, 2]}
			confirmationMessage={(id) =>
				`Are you sure you want to permanently delete item ID ${id}? This action cannot be undone and will delete files from R2.`
			}
			protectedMessage=" and cannot be deleted. Please select another item."
		/>
	);
}
