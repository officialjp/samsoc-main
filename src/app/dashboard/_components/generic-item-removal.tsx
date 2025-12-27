'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '~/components/ui/dropdown-menu';
import { Loader2, Trash2, ChevronRight, Search } from 'lucide-react';

export interface RemovalItem {
	id: number;
}

export interface GenericItemRemovalProps<T extends RemovalItem> {
	title: string;
	items: T[] | undefined;
	isLoading: boolean;
	isSubmitting: boolean;
	onDelete: (id: number) => void;
	getItemLabel: (item: T) => string;
	getSearchableFields: (item: T) => string[];
	searchPlaceholder?: string;
	useWindowConfirm?: boolean;
	confirmationMessage?: (id: number) => string;
	protectedIds?: number[];
	protectedMessage?: string;
	useWarningMessage?: boolean;
}

export default function GenericItemRemoval<T extends RemovalItem>({
	title,
	items,
	isLoading,
	isSubmitting,
	onDelete,
	getItemLabel,
	getSearchableFields,
	searchPlaceholder = 'Search...',
	useWindowConfirm = true,
	confirmationMessage,
	protectedIds = [],
	protectedMessage = ' and cannot be deleted.',
	useWarningMessage = false,
}: GenericItemRemovalProps<T>) {
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		type: 'success' | 'error' | 'warning';
		message: string;
	} | null>(null);

	useEffect(() => {
		if (statusMessage) {
			const timer = setTimeout(() => setStatusMessage(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [statusMessage]);

	useEffect(() => {
		if (confirmingDelete) {
			const timer = setTimeout(() => setConfirmingDelete(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [confirmingDelete]);

	const filteredItems = (() => {
		if (!items) return [];
		if (!searchTerm) return items;

		const lowerCaseSearchTerm = searchTerm.toLowerCase();

		return items.filter((item) =>
			getSearchableFields(item).some((field) =>
				String(field).toLowerCase().includes(lowerCaseSearchTerm),
			),
		);
	})();

	const selectedItemLabel = (() => {
		if (!items || !selectedItemId) return 'Select item to delete...';
		const selectedItem = items.find((item) => item.id === selectedItemId);
		return selectedItem
			? getItemLabel(selectedItem)
			: 'Select item to delete...';
	})();

	const isProtected = protectedIds.includes(selectedItemId ?? -1);

	const handleDelete = () => {
		if (!selectedItemId) return;

		if (isProtected) {
			setStatusMessage({
				type: 'warning',
				message: `Item ID ${selectedItemId} is protected${protectedMessage}`,
			});
			return;
		}

		if (useWindowConfirm) {
			const message =
				confirmationMessage?.(selectedItemId) ??
				`Are you sure you want to permanently delete item ID ${selectedItemId}? This action cannot be undone.`;

			if (!window.confirm(message)) return;

			onDelete(selectedItemId);
			setSelectedItemId(null);
			setSearchTerm('');
			setConfirmingDelete(false);
		} else {
			if (!confirmingDelete) {
				const warningMsg =
					confirmationMessage?.(selectedItemId) ??
					`Click 'Confirm Delete' again to permanently remove item ID ${selectedItemId}.`;
				setStatusMessage({
					type: 'warning',
					message: warningMsg,
				});
				setConfirmingDelete(true);
				return;
			}

			setStatusMessage(null);
			onDelete(selectedItemId);
			setSelectedItemId(null);
			setSearchTerm('');
			setConfirmingDelete(false);
		}
	};

	const handleValueChange = (value: string) => {
		const newId = Number(value);
		setSelectedItemId(newId);
		setConfirmingDelete(false);
		setStatusMessage(null);
	};

	const buttonText =
		useWarningMessage && confirmingDelete
			? 'Confirm Delete'
			: 'Delete Selected';

	return (
		<div className="space-y-4 p-6 border rounded-lg shadow-md bg-white">
			<h3 className="text-xl font-bold border-b pb-2 flex items-center">
				<Trash2 className="mr-2 h-5 w-5" />
				{title}
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
					Loading items...
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
										placeholder={searchPlaceholder}
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
													? 'No matching items found.'
													: 'No items available.'}
											</DropdownMenuLabel>
										) : (
											filteredItems.map((item: T) => (
												<DropdownMenuRadioItem
													key={item.id}
													value={String(item.id)}
													disabled={protectedIds.includes(
														item.id,
													)}
												>
													{getItemLabel(item)}
												</DropdownMenuRadioItem>
											))
										)}
									</DropdownMenuRadioGroup>
								</div>

								{items.length > filteredItems.length && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">
											Showing {filteredItems.length} of{' '}
											{items.length} total items.
										</DropdownMenuLabel>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<Button
						onClick={handleDelete}
						disabled={
							!selectedItemId || isSubmitting || isProtected
						}
						className={`w-full sm:w-auto flex items-center transition-all ${
							useWarningMessage && confirmingDelete
								? 'bg-red-700 hover:bg-red-800'
								: ''
						}`}
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

			{selectedItemId && isProtected && (
				<p className="text-red-500 text-sm mt-2">
					<span className="font-bold">
						Item ID {selectedItemId} is protected
					</span>
					{protectedMessage}
				</p>
			)}
		</div>
	);
}
