'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, XCircle, ChevronDown, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { api } from '~/trpc/react';

import { Button } from '~/app/_components/ui/button';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/app/_components/ui/dropzone';
import { Input } from '~/app/_components/ui/input';
import { Label } from '~/app/_components/ui/label';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/app/_components/ui/form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/app/_components/ui/dropdown-menu';

import type { AnimeCard } from '@prisma/client';

const animeCardFormSchema = z.object({
	id: z.number(),
	title: z.string().min(1, 'Title is required.'),
	episode: z.string().min(1, 'Episode is required.'),
	mal_link: z.string().nonempty('MAL image link is required'),
	total_episodes: z.number(),
	show_type: z.string().nonempty('Show Type is required'),
	source: z.string().nonempty('Source is required'),
	studio: z.string().nonempty('Studio is required'),
	newImage: z
		.custom<File>((val) => val instanceof File || val === undefined, {
			message: 'Image must be a valid file.',
		})
		.optional(),
});

type AnimeCardFormValues = z.infer<typeof animeCardFormSchema>;

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
		<div className="relative h-96 shrink-0 overflow-hidden rounded-md border-2 border-border">
			<Image
				src={src}
				alt="Card Image Preview"
				fill
				style={{ objectFit: 'cover' }}
				unoptimized={!!file}
			/>
		</div>
	);
};

interface CardEditorRowProps {
	card: AnimeCard;
	onSuccess: () => void;
}

const MemberEditorRow: React.FC<CardEditorRowProps> = ({ card, onSuccess }) => {
	const form = useForm<AnimeCardFormValues>({
		resolver: zodResolver(animeCardFormSchema),
		defaultValues: {
			id: card.id,
			title: card.title,
			episode: card.episode,
			mal_link: card.mal_link,
			total_episodes: card.total_episodes,
			show_type: card.show_type,
			source: card.source,
			studio: card.studio,
			newImage: undefined,
		},
		mode: 'onChange',
	});

	const newImageFile = useWatch({ control: form.control, name: 'newImage' });
	const isFormDirty = form.formState.isDirty || !!newImageFile;

	const updateCardMutation = api.animecards.updateCard.useMutation({
		onSuccess: (updatedCard) => {
			onSuccess();
			form.reset({
				id: updatedCard.id,
				title: updatedCard.title,
				episode: updatedCard.episode,
				mal_link: updatedCard.mal_link,
				total_episodes: updatedCard.total_episodes,
				show_type: updatedCard.show_type,
				source: updatedCard.source,
				studio: updatedCard.studio,
				newImage: undefined,
			});
		},
	});

	const onSubmit = (data: AnimeCardFormValues) => {
		if (!isFormDirty) return;

		if (data.newImage) {
			const file = data.newImage;
			const reader = new FileReader();

			reader.onloadend = () => {
				if (typeof reader.result === 'string') {
					const newImagePayload = {
						base64: reader.result,
						fileName: file.name,
						mimeType: file.type,
					};

					updateCardMutation.mutate({
						id: data.id,
						title:
							data.title !== card.title ? data.title : undefined,
						episode:
							data.episode !== card.episode
								? data.episode
								: undefined,
						mal_link:
							data.mal_link !== card.mal_link
								? data.mal_link
								: undefined,
						total_episodes: data.total_episodes,
						show_type:
							data.show_type !== card.show_type
								? data.show_type
								: undefined,
						studio:
							data.studio !== card.studio
								? data.studio
								: undefined,
						newImage: newImagePayload,
					});
				}
			};
			reader.readAsDataURL(file);
		} else {
			const title = data.title !== card.title ? data.title : undefined;
			const episode =
				data.episode !== card.episode ? data.episode : undefined;
			const mal_link =
				data.mal_link !== card.mal_link ? data.mal_link : undefined;
			const total_episodes = data.total_episodes;
			const show_type =
				data.show_type !== card.show_type ? data.show_type : undefined;
			const studio =
				data.studio !== card.studio ? data.studio : undefined;
			if (
				title ||
				episode ||
				mal_link ||
				total_episodes ||
				show_type ||
				studio
			) {
				updateCardMutation.mutate({
					id: data.id,
					title,
					episode,
					mal_link,
					total_episodes,
					show_type,
					studio,
				});
			}
		}
	};

	const isPending = updateCardMutation.isPending;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4 rounded-base border-2 border-border bg-main p-6 shadow-shadow"
			>
				<div className="flex items-start gap-6">
					<div className="flex w-full max-w-xs flex-col gap-2 shrink-0">
						<Label>Card Image</Label>
						<ImagePreview file={newImageFile} url={card.source} />

						<FormField
							control={form.control}
							name="newImage"
							render={({ field }) => (
								<FormItem className="mt-2">
									<FormControl>
										<Dropzone
											accept={{
												'image/jpeg': ['.jpg', '.jpeg'],
												'image/png': ['.png'],
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
									form.setValue('newImage', undefined, {
										shouldDirty: true,
									})
								}
							>
								<XCircle className="size-4" />
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
											placeholder="Enter anime title"
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
							name="episode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Episode</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter the episodes with the correct format"
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
							name="mal_link"
							render={({ field }) => (
								<FormItem>
									<FormLabel>MAL Link</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter the mal image link for the anime"
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
							name="total_episodes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Episodes</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter the amount of total episodes"
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
							name="show_type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type of Show</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter the type of the show"
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
							name="studio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Studio of Anime</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter the anime studio"
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
							name="source"
							render={({ field }) => (
								<FormItem>
									<FormLabel>MAL Image Link</FormLabel>
									<FormControl>
										<Input
											placeholder="Optionally enter the mal image link if you don't have the image saved as a file"
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
						{isPending && <Loader2 className="animate-spin" />}
						{updateCardMutation.isSuccess
							? 'Saved!'
							: 'Save Changes'}
						{!isPending && !updateCardMutation.isSuccess && (
							<Save />
						)}
					</Button>
				</div>
				{updateCardMutation.isError && (
					<p className="mt-2 text-sm text-red-500">
						Error: {updateCardMutation.error.message}
					</p>
				)}
			</form>
		</Form>
	);
};

export function AnimeCardEditor() {
	const [selectedCardId, setSelectedCardId] = React.useState<number | null>(
		null,
	);
	const utils = api.useUtils();

	const {
		data: cards,
		isFetching,
		isError,
	} = api.animecards.getAllCards.useQuery();

	const refetch = () => {
		void utils.animecards.getAllCards.invalidate();
	};

	const selectedCard = cards?.find((m) => m.id === selectedCardId) ?? null;

	React.useEffect(() => {
		if (cards && cards.length > 0 && selectedCardId === null) {
			setSelectedCardId(cards[0]!.id);
		}
	}, [cards, selectedCardId]);

	if (isFetching) {
		return <p className="p-6">Loading anime cards...</p>;
	}

	if (isError) {
		return <p className="p-6 text-red-500">Failed to load anime cards.</p>;
	}

	if (!cards || cards.length === 0) {
		return <p className="p-6">No anime cards found to edit.</p>;
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-heading">Edit Anime Cards</h2>

			<div className="flex items-center gap-4">
				<Label htmlFor="title-select">Select Card:</Label>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							id="title-select"
							className="min-w-[200px] justify-between"
						>
							{selectedCard
								? selectedCard.title
								: 'Select a title'}
							<ChevronDown className="ml-2 size-4 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]">
						{cards.map((cards) => (
							<DropdownMenuItem
								key={cards.id}
								onClick={() => setSelectedCardId(cards.id)}
								disabled={cards.id === selectedCardId}
							>
								<Sparkles className="mr-2 size-4" />
								{cards.title}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{selectedCard ? (
				<MemberEditorRow
					key={selectedCard.id}
					card={selectedCard}
					onSuccess={refetch}
				/>
			) : (
				<p className="p-4 text-base font-base">
					Please select a card to begin editing it.
				</p>
			)}
		</div>
	);
}
