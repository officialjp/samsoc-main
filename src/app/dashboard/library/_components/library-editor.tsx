'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Loader2,
	Save,
	XCircle,
	ChevronDown,
	BookOpen,
	Search,
	Pencil,
} from 'lucide-react';
import Image from 'next/image';

import { api } from '~/trpc/react';
import { revalidateLibraryPage } from '~/server/actions/revalidate';
import { cn } from '~/lib/utils';

import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/components/ui/dropzone';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from '~/components/ui/dropdown-menu';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';
import {
	DashboardAlert,
	DashboardEmptyState,
} from '../../_components/dashboard-alert';

interface MangaItem {
	id: number;
	title: string;
	author: string;
	volume: number;
	borrowed_by: string | null;
	source: string;
}

const mangaFormSchema = z.object({
	id: z.number().int().min(1),
	title: z.string().min(1),
	author: z.string().min(1),
	volume: z.number().int().min(1),
	borrowed_by: z.string().optional(),
	currentSource: z.string().nonempty(),
	newImage: z.custom<File>(
		(val) => val instanceof File || val === undefined,
		{
			message: 'Image must be a valid file.',
		},
	),
});

type MangaFormValues = z.infer<typeof mangaFormSchema>;

const ImagePreview = ({
	file,
	url,
}: {
	file: File | undefined;
	url: string | null | undefined;
}) => {
	const src = file ? URL.createObjectURL(file) : url;

	if (!src) return null;

	return (
		<div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
			<Image
				src={src}
				alt="Manga Image Preview"
				fill
				className="object-cover"
				unoptimized={!!file}
			/>
		</div>
	);
};

interface MangaEditorRowProps {
	manga: MangaItem;
	onSuccess: () => void;
}

const MangaEditorRow: React.FC<MangaEditorRowProps> = ({
	manga,
	onSuccess,
}) => {
	const form = useForm<MangaFormValues>({
		resolver: zodResolver(mangaFormSchema),
		defaultValues: {
			id: manga.id,
			title: manga.title,
			author: manga.author,
			volume: manga.volume,
			borrowed_by: manga.borrowed_by ?? '',
			currentSource: manga.source,
			newImage: undefined,
		},
		mode: 'onChange',
	});

	const newImageFile = useWatch({ control: form.control, name: 'newImage' });
	const isFormDirty = form.formState.isDirty || !!newImageFile;

	const updateMangaMutation = api.manga.updateManga.useMutation({
		onSuccess: (updatedManga) => {
			onSuccess();
			void revalidateLibraryPage();
			form.reset({
				id: updatedManga.id,
				title: updatedManga.title,
				author: updatedManga.author,
				volume: updatedManga.volume,
				borrowed_by: updatedManga.borrowed_by ?? undefined,
				currentSource: updatedManga.source,
				newImage: undefined,
			});
		},
	});

	const onSubmit = (data: MangaFormValues) => {
		if (!isFormDirty) return;

		const isTitleChanged = data.title !== manga.title;
		const titleToSend: string = data.title ?? manga.title;

		const isAuthorChanged = data.author !== manga.author;
		const authorToSend: string = data.author ?? manga.author;

		const isVolumeChanged = data.volume !== manga.volume;
		const volumeToSend: number = data.volume ?? manga.volume;

		const currentBorrowedBy = manga.borrowed_by ?? undefined;
		const newBorrowedBy = data.borrowed_by;

		const borrowed_by =
			newBorrowedBy !== currentBorrowedBy ? newBorrowedBy : undefined;

		let newImagePayload:
			| { base64: string; fileName: string; mimeType: string }
			| undefined = undefined;

		const executeMutation = (imagePayload?: typeof newImagePayload) => {
			if (
				isTitleChanged ||
				isAuthorChanged ||
				isVolumeChanged ||
				borrowed_by !== undefined ||
				imagePayload
			) {
				updateMangaMutation.mutate({
					id: data.id,
					title: titleToSend,
					author: authorToSend,
					volume: volumeToSend,
					borrowed_by,
					newImage: imagePayload,
				});
			}
		};

		if (data.newImage) {
			const file = data.newImage;
			const reader = new FileReader();

			reader.onloadend = () => {
				if (typeof reader.result === 'string') {
					newImagePayload = {
						base64: reader.result,
						fileName: file.name,
						mimeType: file.type,
					};
					executeMutation(newImagePayload);
				}
			};
			reader.readAsDataURL(file);
		} else {
			executeMutation();
		}
	};

	const isPending = updateMangaMutation.isPending;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
			>
				<div className="flex flex-col lg:flex-row items-start gap-6">
					<div className="flex w-full lg:w-auto lg:max-w-xs flex-col gap-4 shrink-0">
						<label className="text-sm font-bold text-gray-900">
							Manga Image
						</label>
						<div className="flex justify-center">
							<ImagePreview
								file={newImageFile}
								url={manga.source}
							/>
						</div>

						<FormField
							control={form.control}
							name="newImage"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Dropzone
											accept={{
												'image/avif': ['.avif'],
											}}
											maxSize={1024 * 1024 * 10}
											minSize={1024}
											maxFiles={1}
											onDrop={(acceptedFiles) => {
												field.onChange(
													acceptedFiles[0],
												);
											}}
											src={
												field.value ? [field.value] : []
											}
											disabled={isPending}
										>
											<DropzoneContent />
											<DropzoneEmptyState />
										</Dropzone>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						{newImageFile && (
							<button
								type="button"
								onClick={() =>
									form.setValue(
										'newImage',
										undefined as unknown as File,
										{
											shouldDirty: true,
										},
									)
								}
								className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black rounded-xl bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
							>
								<XCircle className="w-4 h-4" />
								Remove Image
							</button>
						)}
					</div>

					<div className="flex-1 w-full space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Title
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter manga title"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Author
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter manga author"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="volume"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Volume
									</FormLabel>
									<FormControl>
										<DashboardInput
											type="number"
											placeholder="Enter manga volume"
											disabled={isPending}
											value={field.value ?? ''}
											onChange={(e) => {
												const value = e.target.value;
												const numberValue = parseInt(
													value,
													10,
												);
												if (value === '') {
													field.onChange(undefined);
												} else if (
													!isNaN(numberValue)
												) {
													field.onChange(numberValue);
												}
											}}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="borrowed_by"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Borrowed By
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter borrower (can be empty)"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="mt-6 pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
					{updateMangaMutation.isError && (
						<DashboardAlert
							type="error"
							message={updateMangaMutation.error.message}
							className="flex-1"
						/>
					)}
					<div className="flex-1" />
					<button
						type="submit"
						disabled={!isFormDirty || isPending}
						className={cn(
							'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black rounded-xl transition-all',
							'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
							'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
							updateMangaMutation.isSuccess
								? 'bg-green-200 hover:bg-green-300'
								: 'bg-blue-200 hover:bg-blue-300',
							'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
						)}
					>
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Saving...</span>
							</>
						) : updateMangaMutation.isSuccess ? (
							<>
								<Save className="w-4 h-4" />
								<span>Saved!</span>
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								<span>Save Changes</span>
							</>
						)}
					</button>
				</div>
			</form>
		</Form>
	);
};

export function MangaItemEditor() {
	const [selectedMangaId, setSelectedMangaId] = React.useState<number | null>(
		null,
	);
	const [searchTerm, setSearchTerm] = React.useState('');
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
	const utils = api.useUtils();

	const {
		data: manga,
		isFetching,
		isError,
	} = api.manga.getAllItems.useQuery();

	const refetch = () => {
		void utils.manga.getAllItems.invalidate();
	};

	const selectedManga = manga?.find((m) => m.id === selectedMangaId) ?? null;

	React.useEffect(() => {
		if (manga && manga.length > 0 && selectedMangaId === null) {
			setSelectedMangaId(manga[0]!.id);
		}
	}, [manga, selectedMangaId]);

	const filteredManga = (() => {
		if (!manga) return [];
		const lowerCaseSearchTerm = searchTerm.toLowerCase();

		return manga.filter(
			(m) =>
				String(m.id).includes(lowerCaseSearchTerm) ||
				m.title.toLowerCase().includes(lowerCaseSearchTerm) ||
				m.author.toLowerCase().includes(lowerCaseSearchTerm) ||
				String(m.volume).includes(lowerCaseSearchTerm),
		);
	})();

	const handleValueChange = (value: string) => {
		setSelectedMangaId(Number(value));
		setIsDropdownOpen(false);
		setSearchTerm('');
	};

	const selectedItemLabel = (() => {
		if (!manga || !selectedMangaId) return 'Select a manga item...';
		const selectedItem = manga.find((item) => item.id === selectedMangaId);
		if (!selectedItem) return 'Select a manga item...';

		return `ID: ${selectedItem.id} VOL: ${selectedItem.volume} - "${selectedItem.title.substring(0, 30)}${selectedItem.title.length > 30 ? '...' : ''}"`;
	})();

	if (isFetching) {
		return (
			<DashboardCard>
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-3 text-gray-600">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="font-semibold">Loading mangas...</span>
					</div>
				</div>
			</DashboardCard>
		);
	}

	if (isError) {
		return (
			<DashboardCard>
				<DashboardAlert
					type="error"
					title="Error"
					message="Failed to load mangas. Please try again."
				/>
			</DashboardCard>
		);
	}

	if (!manga || manga.length === 0) {
		return (
			<DashboardCard>
				<DashboardEmptyState
					icon={<BookOpen className="w-12 h-12" />}
					title="No mangas found"
					description="Add some manga entries first before editing."
				/>
			</DashboardCard>
		);
	}

	return (
		<DashboardCard>
			<DashboardCardHeader icon={<Pencil className="w-5 h-5" />}>
				Edit Manga Item
			</DashboardCardHeader>
			<DashboardCardContent className="space-y-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
					<label
						htmlFor="manga-select"
						className="text-sm font-bold text-gray-900 shrink-0"
					>
						Select Manga:
					</label>
					<DropdownMenu
						open={isDropdownOpen}
						onOpenChange={setIsDropdownOpen}
					>
						<DropdownMenuTrigger asChild>
							<button
								id="manga-select"
								className={cn(
									'flex-1 w-full flex items-center justify-between px-4 py-3 text-left font-semibold border-2 border-black rounded-xl bg-white transition-all',
									'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
									'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
									'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
								)}
							>
								<span
									className={cn(
										'truncate pr-4',
										selectedMangaId
											? 'text-gray-900'
											: 'text-gray-500',
									)}
								>
									{selectedItemLabel}
								</span>
								<ChevronDown
									className={cn(
										'w-5 h-5 text-gray-500 transition-transform flex-shrink-0',
										isDropdownOpen && 'rotate-180',
									)}
								/>
							</button>
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
							<DropdownMenuLabel className="px-2 py-2 font-bold text-sm">
								Select an Item to Edit
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-gray-200 h-0.5" />

							<div className="p-2">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										placeholder="Search by ID, Title, Author, or Volume..."
										value={searchTerm}
										onChange={(e) =>
											setSearchTerm(e.target.value)
										}
										className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-50 text-gray-900 border-2 border-gray-200 font-medium text-sm focus:outline-none focus:border-black transition-colors"
										onKeyDown={(e) => e.stopPropagation()}
										autoFocus={true}
									/>
								</div>
							</div>
							<DropdownMenuSeparator className="bg-gray-200 h-0.5" />

							<div className="max-h-60 overflow-y-auto">
								<DropdownMenuRadioGroup
									value={
										selectedMangaId
											? String(selectedMangaId)
											: ''
									}
									onValueChange={handleValueChange}
								>
									{filteredManga.length > 0 ? (
										filteredManga.map((manga) => {
											const itemLabel = `ID: ${manga.id} VOL: ${manga.volume} - ${manga.title.substring(0, 40)}${manga.title.length > 40 ? '...' : ''}`;

											return (
												<DropdownMenuRadioItem
													key={manga.id}
													value={String(manga.id)}
													className="rounded-lg font-medium py-2.5 cursor-pointer"
												>
													<BookOpen className="mr-2 w-4 h-4 shrink-0" />
													{itemLabel}
												</DropdownMenuRadioItem>
											);
										})
									) : (
										<DropdownMenuLabel className="p-3 text-gray-500 font-normal text-center">
											No results found.
										</DropdownMenuLabel>
									)}
								</DropdownMenuRadioGroup>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{selectedManga ? (
					<MangaEditorRow
						key={selectedManga.id}
						manga={selectedManga}
						onSuccess={refetch}
					/>
				) : (
					<DashboardEmptyState
						icon={<BookOpen className="w-10 h-10" />}
						title="Select a manga"
						description="Please select a manga item to begin editing their details."
					/>
				)}
			</DashboardCardContent>
		</DashboardCard>
	);
}
