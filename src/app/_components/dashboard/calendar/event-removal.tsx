'use client';

import { api } from '~/trpc/react';
import GenericItemRemoval from '../generalized/generic-item-removal';
import { toast } from 'sonner';

interface EventItem {
	id: number;
	title: string;
}

export default function EventRemove() {
	const { data: items, isLoading } =
		api.event.getAllItems.useQuery<EventItem[]>();

	const utils = api.useUtils();
	const deleteMutation = api.event.deleteItem.useMutation({
		onSuccess: () => {
			void utils.event.getAllItems.invalidate();
			toast.success('Event deleted successfully.');
		},
		onError: (error) => {
			toast.error(`Deletion failed: ${error.message}`);
		},
	});

	const handleDelete = (id: number) => {
		deleteMutation.mutate({ id });
	};

	const getItemLabel = (item: EventItem): string => {
		return `ID: ${item.id} (Title: ${item.title})`;
	};

	const getSearchableFields = (item: EventItem): string[] => {
		return [String(item.id), item.title];
	};

	return (
		<GenericItemRemoval<EventItem>
			title="Remove Event Item"
			items={items}
			isLoading={isLoading}
			isSubmitting={deleteMutation.isPending}
			onDelete={handleDelete}
			getItemLabel={getItemLabel}
			getSearchableFields={getSearchableFields}
			searchPlaceholder="Search by ID or Title..."
			useWindowConfirm={true}
		/>
	);
}
