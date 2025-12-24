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
import { toast } from 'sonner';

interface CarouselItem {
	id: number;
	alt: string;
	order: number;
}

export default function CarouselRemove() {
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const {
		data: items,
		isLoading,
	} = api.carousel.getAllItems.useQuery();

	const deleteMutation = api.carousel.deleteItem.useMutation({
		onSuccess: () => {
			toast.success(
				`Item ID ${selectedItemId} successfully deleted (R2 files cleaned up).`,
			);
			setSelectedItemId(null);
			// No invalidation needed for infrequent data
		},
		onError: (error) => {
			toast.error(`Deletion failed: ${error.message}`);
		},
	});

	const filteredItems = useMemo(() => {
		if (!items) return [];
		if (!searchTerm) return items;

		const lowerCaseSearch = searchTerm.toLowerCase();

		return items.filter((item) => {
			const idMatch = String(item.id).includes(lowerCaseSearch);
			const orderMatch = String(item.order).includes(lowerCaseSearch);
			const altMatch = item.alt.toLowerCase().includes(lowerCaseSearch);

			return idMatch || orderMatch || altMatch;
		});
	}, [items, searchTerm]);

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
			toast.warning('Items with ID 1 and 2 are protected and cannot be deleted.');
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
							<DropdownMenuContent className="w-full sm:w-80 p-0">
								<DropdownMenuLabel className="p-2">
									Select an Item to Delete
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="m-0" />

								<div className="p-2">
									<input
										type="text"
										placeholder="Search by ID, Order, or Alt text..."
										className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
										onKeyDown={(e) => e.stopPropagation()}
									/>
								</div>
								<DropdownMenuSeparator className="m-0" />

								<div className="max-h-60 overflow-y-auto">
									<DropdownMenuRadioGroup
										value={
											selectedItemId
												? String(selectedItemId)
												: ''
										}
										onValueChange={handleValueChange}
									>
										{filteredItems.length === 0 ? (
											<DropdownMenuLabel className="p-2 text-gray-500">
												{searchTerm
													? 'No results found.'
													: 'No items available to delete.'}
											</DropdownMenuLabel>
										) : (
											filteredItems.map(
												(item: CarouselItem) => {
													const isItemProtected =
														item.id === 1 ||
														item.id === 2;
													const itemLabel = `ID: ${item.id} (Order: ${item.order}) - ${item.alt.substring(0, 40)}${item.alt.length > 40 ? '...' : ''}`;

													return (
														<DropdownMenuRadioItem
															key={item.id}
															value={String(
																item.id,
															)}
															disabled={
																isItemProtected
															}
															className="whitespace-normal h-auto py-2"
														>
															{itemLabel}
														</DropdownMenuRadioItem>
													);
												},
											)
										)}
									</DropdownMenuRadioGroup>
								</div>
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
