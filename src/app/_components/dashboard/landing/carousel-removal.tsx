'use client';

import { api } from '~/trpc/react';
import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Loader2, Trash2, ChevronRight } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '../../ui/dropdown-menu';

interface CarouselItem {
	id: number;
	alt: string;
	order: number;
}

export default function CarouselRemove() {
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

	const {
		data: items,
		isLoading,
		refetch,
	} = api.carousel.getAllItems.useQuery();

	const deleteMutation = api.carousel.deleteItem.useMutation({
		onSuccess: () => {
			alert(
				`Item ID ${selectedItemId} successfully deleted (R2 files cleaned up).`,
			);
			setSelectedItemId(null);
			void refetch();
		},
		onError: (error) => {
			alert(`Deletion failed: ${error.message}`);
		},
	});

	const isSubmitting = deleteMutation.isPending;
	const itemToDelete = selectedItemId;

	const selectedItemLabel = useMemo(() => {
		if (!items || !itemToDelete) return 'Select item to delete...';
		const selectedItem = items.find((item) => item.id === itemToDelete);
		if (!selectedItem) return 'Select item to delete...';

		return `ID: ${selectedItem.id} (Order: ${selectedItem.order}) - "${selectedItem.alt.substring(0, 30)}${selectedItem.alt.length > 30 ? '...' : ''}"`;
	}, [items, itemToDelete]);

	const handleDelete = () => {
		if (!itemToDelete) return;

		if (itemToDelete === 1 || itemToDelete === 2) {
			alert('Items with ID 1 and 2 are protected and cannot be deleted.');
			return;
		}

		if (
			window.confirm(
				`Are you sure you want to permanently delete item ID ${itemToDelete}? This action cannot be undone and will delete files from R2.`,
			)
		) {
			deleteMutation.mutate({ id: itemToDelete });
		}
	};

	const handleValueChange = (value: string) => {
		setSelectedItemId(Number(value));
	};

	const isProtected = itemToDelete === 1 || itemToDelete === 2;

	return (
		<div className="space-y-4 p-6 border rounded-lg shadow-md bg-white">
			<h3 className="text-lg font-semibold border-b pb-2">
				Remove Carousel Item
			</h3>

			{isLoading && (
				<div className="flex items-center justify-center py-4">
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Loading items...
				</div>
			)}

			{!isLoading && items && (
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div className="grow">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									disabled={
										isSubmitting || items.length === 0
									}
									className="w-full justify-between"
								>
									{selectedItemLabel}
									<ChevronRight className="h-4 w-4 opacity-50 rotate-90 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-full sm:w-80">
								<DropdownMenuLabel>
									Select an Item to Delete
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuRadioGroup
									value={
										selectedItemId
											? String(selectedItemId)
											: ''
									}
									onValueChange={handleValueChange}
								>
									{items.length === 0 ? (
										<DropdownMenuLabel>
											No items available to delete.
										</DropdownMenuLabel>
									) : (
										items.map((item: CarouselItem) => {
											const isItemProtected =
												item.id === 1 || item.id === 2;
											const itemLabel = `ID: ${item.id} (Order: ${item.order}) - ${item.alt.substring(0, 40)}${item.alt.length > 40 ? '...' : ''}`;

											return (
												<DropdownMenuRadioItem
													key={item.id}
													value={String(item.id)}
													disabled={isItemProtected}
												>
													{itemLabel}
												</DropdownMenuRadioItem>
											);
										})
									)}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Button
						onClick={handleDelete}
						disabled={!itemToDelete || isSubmitting || isProtected}
						className="w-full sm:w-auto flex items-center"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Selected
							</>
						)}
					</Button>
				</div>
			)}

			{itemToDelete && isProtected && (
				<p className="text-red-500 text-sm mt-2">
					<span className="font-bold">
						Item ID {itemToDelete} is protected
					</span>{' '}
					and cannot be deleted. Please select another item.
				</p>
			)}
		</div>
	);
}
