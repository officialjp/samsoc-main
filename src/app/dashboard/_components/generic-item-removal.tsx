'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '~/lib/utils';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from '~/components/ui/dropdown-menu';
import {
	Loader2,
	Trash2,
	ChevronDown,
	Search,
	PackageOpen,
} from 'lucide-react';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
} from './dashboard-card';
import { DashboardAlert, DashboardEmptyState } from './dashboard-alert';

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
		<DashboardCard>
			<DashboardCardHeader icon={<Trash2 className="w-5 h-5" />}>
				{title}
			</DashboardCardHeader>

			<DashboardCardContent>
				{statusMessage && (
					<DashboardAlert
						type={statusMessage.type}
						message={statusMessage.message}
						onDismiss={() => setStatusMessage(null)}
					/>
				)}

				{isLoading && (
					<div className="flex items-center justify-center py-8">
						<div className="flex items-center gap-3 text-gray-600">
							<Loader2 className="h-6 w-6 animate-spin" />
							<span className="font-semibold">
								Loading items...
							</span>
						</div>
					</div>
				)}

				{!isLoading && items && items.length === 0 && (
					<DashboardEmptyState
						icon={<PackageOpen className="w-12 h-12" />}
						title="No items available"
						description="There are no items to delete at this time."
					/>
				)}

				{!isLoading && items && items.length > 0 && (
					<div className="flex flex-col sm:flex-row items-stretch gap-3">
						<div className="flex-1">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										disabled={
											isSubmitting || items.length === 0
										}
										className={cn(
											'w-full flex items-center justify-between px-4 py-3 text-left font-semibold border-2 border-black rounded-xl bg-white transition-all',
											'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
											'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
											'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
											'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
										)}
									>
										<span
											className={cn(
												selectedItemId
													? 'text-gray-900'
													: 'text-gray-500',
											)}
										>
											{selectedItemLabel}
										</span>
										<ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
									</button>
								</DropdownMenuTrigger>

								<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
									<div className="relative mb-2">
										<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
										<input
											placeholder={searchPlaceholder}
											className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 border-2 border-gray-200 font-medium text-sm focus:outline-none focus:border-black transition-colors"
											value={searchTerm}
											onChange={(
												e: React.ChangeEvent<HTMLInputElement>,
											) => setSearchTerm(e.target.value)}
										/>
									</div>
									<DropdownMenuSeparator className="bg-gray-200 h-0.5" />

									<div className="max-h-64 overflow-y-auto">
										<DropdownMenuRadioGroup
											value={
												selectedItemId
													? String(selectedItemId)
													: ''
											}
											onValueChange={handleValueChange}
										>
											{filteredItems.length === 0 ? (
												<DropdownMenuLabel className="text-gray-500 italic px-2 py-3 text-center">
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
														className="rounded-lg font-medium py-2.5 cursor-pointer"
													>
														{getItemLabel(item)}
													</DropdownMenuRadioItem>
												))
											)}
										</DropdownMenuRadioGroup>
									</div>

									{items.length > filteredItems.length && (
										<>
											<DropdownMenuSeparator className="bg-gray-200 h-0.5" />
											<DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1.5 font-medium">
												Showing {filteredItems.length}{' '}
												of {items.length} items
											</DropdownMenuLabel>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<button
							onClick={handleDelete}
							disabled={
								!selectedItemId || isSubmitting || isProtected
							}
							className={cn(
								'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black rounded-xl transition-all',
								'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
								'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
								useWarningMessage && confirmingDelete
									? 'bg-red-600 text-white hover:bg-red-700 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
									: 'bg-red-100 text-red-700 hover:bg-red-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
							)}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Deleting...</span>
								</>
							) : (
								<>
									<Trash2 className="h-4 w-4" />
									<span>{buttonText}</span>
								</>
							)}
						</button>
					</div>
				)}

				{selectedItemId && isProtected && (
					<DashboardAlert
						type="warning"
						title="Protected Item"
						message={`Item ID ${selectedItemId} is protected${protectedMessage}`}
					/>
				)}
			</DashboardCardContent>
		</DashboardCard>
	);
}
