'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { api } from '~/trpc/react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '../../ui/dropdown-menu';
import { Loader2, Trash2, ChevronRight, Search } from 'lucide-react';

interface EventItem {
	id: number;
	title: string;
}

export default function EventRemove() {
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		type: 'success' | 'error' | 'warning';
		message: string;
	} | null>(null);

	const {
		data: items,
		isLoading,
	} = api.event.getAllItems.useQuery<EventItem[]>();

	const utils = api.useUtils();
	const deleteMutation = api.event.deleteItem.useMutation({
		onSuccess: () => {
			void utils.event.getAllItems.invalidate();
			setStatusMessage({
				type: 'success',
				message: `Event ID ${selectedItemId} successfully deleted.`,
			});

			setSelectedItemId(null);
			setSearchTerm('');
			setConfirmingDelete(false);
		},
		onError: (error) => {
			setStatusMessage({
				type: 'error',
				message: `Deletion failed: ${error.message}`,
			});
			setConfirmingDelete(false);
		},
	});

	useEffect(() => {
		if (statusMessage) {
			const timer = setTimeout(() => setStatusMessage(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [statusMessage]);

	const isSubmitting = deleteMutation.isPending;
	const itemToDelete = selectedItemId;

	const filteredItems = useMemo(() => {
		if (!items) return [];
		if (!searchTerm) return items;

		const lowerCaseSearchTerm = searchTerm.toLowerCase();

		return items
			.filter(
				(item) =>
					String(item.id).includes(lowerCaseSearchTerm) ||
					item.title.toLowerCase().includes(lowerCaseSearchTerm),
			)
			.sort((a, b) => a.id - b.id);
	}, [items, searchTerm]);

	const selectedItemLabel = useMemo(() => {
		if (!items || !itemToDelete) return 'Select item to delete...';
		const selectedItem = items.find((item) => item.id === itemToDelete);
		return selectedItem
			? `ID: ${selectedItem.id} (Title: ${selectedItem.title})`
			: 'Select item to delete...';
	}, [items, itemToDelete]);

	const handleDelete = () => {
		if (!itemToDelete) return;

		if (!confirmingDelete) {
			setStatusMessage({
				type: 'warning',
				message: `Click 'Confirm Delete' again to permanently remove event ID ${itemToDelete}.`,
			});
			setConfirmingDelete(true);
			const timer = setTimeout(() => setConfirmingDelete(false), 3000);
			return () => clearTimeout(timer);
		}

		setStatusMessage(null);
		deleteMutation.mutate({ id: itemToDelete });
		setConfirmingDelete(false);
	};

	const handleValueChange = (value: string) => {
		const newId = Number(value);
		setSelectedItemId(newId);
		setConfirmingDelete(false);
		setStatusMessage(null);
	};

	const buttonText = confirmingDelete ? 'Confirm Delete' : 'Delete Selected';

	return (
		<div className="space-y-4 p-6 border rounded-lg shadow-md bg-white">
			<h3 className="text-xl font-bold border-b pb-2 flex items-center">
				<Trash2 className="mr-2 h-5 w-5" />
				Remove Event Item
			</h3>

			{statusMessage && (
				<div
					className={`text-sm p-3 rounded-lg border transition-all duration-300
                        ${statusMessage.type === 'success' ? 'text-green-700 bg-green-100 border-green-300' : ''}
                        ${statusMessage.type === 'error' ? 'text-red-700 bg-red-100 border-red-300' : ''}
                        ${statusMessage.type === 'warning' ? 'text-yellow-700 bg-yellow-100 border-yellow-300' : ''}
                    `}
				>
					<span className="font-semibold">
						{statusMessage.type.charAt(0).toUpperCase() +
							statusMessage.type.slice(1)}
						:
					</span>{' '}
					{statusMessage.message}
				</div>
			)}

			{isLoading && (
				<div className="flex items-center justify-center py-4 text-gray-500">
					<Loader2 className="mr-2 h-5 w-5 animate-spin" />
					Loading event items...
				</div>
			)}

			{!isLoading && items && (
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div className="grow relative">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									disabled={
										isSubmitting || items.length === 0
									}
									className="w-full justify-between hover:border-red-300"
								>
									{selectedItemLabel}
									<ChevronRight className="h-4 w-4 opacity-50 rotate-90 shrink-0 ml-2" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent className="sm:w-80 p-1">
								<div className="p-1 relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
									<Input
										placeholder="Search by ID or Title..."
										className="w-full pl-9 h-9"
										value={searchTerm}
										onChange={(
											e: React.ChangeEvent<HTMLInputElement>,
										) => setSearchTerm(e.target.value)}
									/>
								</div>
								<DropdownMenuSeparator />

								<div className="max-h-72 overflow-y-auto">
									<DropdownMenuRadioGroup
										value={
											selectedItemId
												? String(selectedItemId)
												: ''
										}
										onValueChange={handleValueChange}
									>
										{filteredItems.length === 0 ? (
											<DropdownMenuLabel className="text-gray-500 italic px-2 py-1">
												{searchTerm
													? 'No matching events found.'
													: 'No events available.'}
											</DropdownMenuLabel>
										) : (
											filteredItems.map(
												(item: EventItem) => {
													return (
														<DropdownMenuRadioItem
															key={item.id}
															value={String(
																item.id,
															)}
														>
															ID: {item.id}{' '}
															(Title: {item.title}
															){' '}
														</DropdownMenuRadioItem>
													);
												},
											)
										)}
									</DropdownMenuRadioGroup>
								</div>

								{items.length > filteredItems.length && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">
											Showing {filteredItems.length} of{' '}
											{items.length} total events.
										</DropdownMenuLabel>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Delete Button */}
					<Button
						onClick={handleDelete}
						disabled={!itemToDelete || isSubmitting}
						className={`w-full sm:w-auto flex items-center transition-all ${confirmingDelete ? 'bg-red-700 hover:bg-red-800' : ''}`}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Deleting...
							</>
						) : (
							<>
								<Trash2 className="mr-2 h-4 w-4" />
								{buttonText}
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
