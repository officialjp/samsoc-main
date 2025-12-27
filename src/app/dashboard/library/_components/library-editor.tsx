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
} from 'lucide-react';
import Image from 'next/image';

import { api } from '~/trpc/react';

import { Button } from '~/components/ui/button';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/components/ui/dropzone';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
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
		<div className="relative h-48 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-border">
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
			form.reset({
				id: updatedManga.id,
				title: updatedManga.title,
				author: updatedManga.author,
				volume: updatedManga.volume,
				borrowed_by: updatedManga.borrowed_by ?? undefined,
				currentSource: updatedManga.source,
				newImage: undefined, // Clears the file input
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
			newBorrowedBy !== currentBorrowedBy
				? newBorrowedBy // string | undefined
				: undefined; // Omit if not changed

		let newImagePayload:
			| { base64: string; fileName: string; mimeType: string }
			| undefined = undefined;

		const executeMutation = (imagePayload?: typeof newImagePayload) => {
			// Only mutate if *any* field has changed (including the image)
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
				className="flex flex-col gap-4 rounded-2xl border-2 border-border bg-main p-6 shadow-shadow"
			>
				<div className="flex items-start gap-6">
					<div className="flex w-full max-w-xs flex-col gap-2 shrink-0">
						<Label>Manga Image</Label>
						<div className="grow flex justify-center">
							<ImagePreview
								file={newImageFile}
								url={manga.source}
							/>
						</div>

						<FormField
							control={form.control}
							name="newImage"
							render={({ field }) => (
								<FormItem className="mt-2">
									<FormControl>
										<Dropzone
											className="bg-white"
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
									<FormMessage />
								</FormItem>
							)}
						/>
						{newImageFile && (
							<Button
								variant="outline"
								size="sm"
								className="w-full"
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
							>
								<XCircle className="size-4 mr-2" />
								Remove Image
							</Button>
						)}
					</div>

					<div className="flex grow flex-col gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter manga title"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Author</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter manga author"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="volume"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Volume</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Enter manga volume"
											disabled={isPending}
											{...field}
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
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="borrowed_by"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Borrowed By</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter borrower (can be empty)"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						type="submit"
						disabled={!isFormDirty || isPending}
						variant="default"
					>
						{isPending && (
							<Loader2 className="mr-2 size-4 animate-spin" />
						)}
						{updateMangaMutation.isSuccess
							? 'Saved!'
							: 'Save Changes'}
						{!isPending && !updateMangaMutation.isSuccess && (
							<Save className="ml-2 size-4" />
						)}
					</Button>
				</div>
				{updateMangaMutation.isError && (
					<p className="mt-2 text-sm text-red-500">
						Error: {updateMangaMutation.error.message}
					</p>
				)}
			</form>
		</Form>
	);
};

// --- START OF UPDATED COMPONENT ---

export function MangaItemEditor() {
	const [selectedMangaId, setSelectedMangaId] = React.useState<number | null>(
		null,
	);
	// State for search term
	const [searchTerm, setSearchTerm] = React.useState('');
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false); // State to control open/close
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

	// Filter the manga list based on the search term
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
		setIsDropdownOpen(false); // Close dropdown on selection
		setSearchTerm(''); // Clear search term
	};

	const selectedItemLabel = (() => {
		if (!manga || !selectedMangaId) return 'Select a manga item...';
		const selectedItem = manga.find((item) => item.id === selectedMangaId);
		if (!selectedItem) return 'Select a manga item...';

		return `ID: ${selectedItem.id} VOL: ${selectedItem.volume} - "${selectedItem.title.substring(0, 30)}${selectedItem.title.length > 30 ? '...' : ''}"`;
	})();

	if (isFetching) {
		return <p className="p-6">Loading mangas...</p>;
	}

	if (isError) {
		return <p className="p-6 text-red-500">Failed to load mangas.</p>;
	}

	if (!manga || manga.length === 0) {
		return <p className="p-6">No mangas found to edit.</p>;
	}

	return (
		<div className="space-y-4 p-6 border rounded-lg shadow-md bg-white">
			<h3 className="text-lg font-semibold border-b pb-2">
				Edit Manga Item
			</h3>
			<div className="flex items-center gap-4">
				<Label htmlFor="manga-select" className="shrink-0">
					Select Manga:
				</Label>
				<DropdownMenu
					open={isDropdownOpen}
					onOpenChange={setIsDropdownOpen}
				>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							id="manga-select"
							className="min-w-[280px] justify-between grow"
						>
							<span className="truncate pr-4">
								{selectedItemLabel}
							</span>
							<ChevronDown
								className={`ml-2 size-4 opacity-70 transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
							/>
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="w-[80%] min-w-[320px] max-w-lg">
						<DropdownMenuLabel className="p-3">
							Select an Item to Edit
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="m-0" />

						<div className="p-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
								<Input
									placeholder="Search by ID, Title, Author, or Volume..."
									value={searchTerm}
									onChange={(e) =>
										setSearchTerm(e.target.value)
									}
									className="pl-9"
									// Prevent dropdown from closing when typing
									onKeyDown={(e) => e.stopPropagation()}
									autoFocus={true}
								/>
							</div>
						</div>
						<DropdownMenuSeparator className="m-0" />

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
												className="whitespace-normal h-auto py-3 pr-8"
											>
												<BookOpen className="mr-2 size-4 shrink-0" />
												{itemLabel}
											</DropdownMenuRadioItem>
										);
									})
								) : (
									<DropdownMenuLabel className="p-3 text-gray-500 font-normal">
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
				<p className="p-4 text-base font-base">
					Please select a manga item to begin editing their details.
				</p>
			)}
		</div>
	);
}
