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
  Sparkles,
  Tv,
} from 'lucide-react';
import Image from 'next/image';

import { cn } from '~/lib/utils';
import { api } from '~/trpc/react';
import { revalidateHomePage } from '~/server/actions/revalidate';

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '~/components/ui/dropzone';
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';
import { DashboardAlert } from '../../_components/dashboard-alert';

import type { AnimeCard } from 'generated/prisma/client';

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
    <div className="relative h-96 shrink-0 overflow-hidden rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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

  const updateCardMutation = api.animecard.updateCard.useMutation({
    onSuccess: (updatedCard) => {
      onSuccess();
      void revalidateHomePage();
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
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="flex w-full lg:max-w-xs flex-col gap-3 shrink-0">
            <Label className="text-base font-bold">
              Card Image
            </Label>
            <ImagePreview file={newImageFile} url={card.source} />

            <FormField
              control={form.control}
              name="newImage"
              render={({ field }) => (
                <FormItem className="mt-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {newImageFile && (
              <button
                type="button"
                onClick={() =>
                  form.setValue('newImage', undefined, {
                    shouldDirty: true,
                  })
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-red-100 px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-red-200 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              >
                <XCircle className="size-4" />
                Remove Image
              </button>
            )}
          </div>

          <div className="flex grow flex-col gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Title
                    </FormLabel>
                    <FormControl>
                      <DashboardInput
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
                    <FormLabel className="font-bold">
                      Episode
                    </FormLabel>
                    <FormControl>
                      <DashboardInput
                        placeholder="Enter the episodes"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="mal_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    MAL Link
                  </FormLabel>
                  <FormControl>
                    <DashboardInput
                      placeholder="Enter the MAL image link for the anime"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="total_episodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      Total Episodes
                    </FormLabel>
                    <FormControl>
                      <DashboardInput
                        placeholder="Total episodes"
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
                    <FormLabel className="font-bold">
                      Type of Show
                    </FormLabel>
                    <FormControl>
                      <DashboardInput
                        placeholder="e.g. TV, Movie"
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
                    <FormLabel className="font-bold">
                      Studio
                    </FormLabel>
                    <FormControl>
                      <DashboardInput
                        placeholder="Enter the anime studio"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    MAL Image Link
                  </FormLabel>
                  <FormControl>
                    <DashboardInput
                      placeholder="Optionally enter the MAL image link if you don't have the image file"
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

        <div className="flex items-center justify-between gap-4 border-t-2 border-black/10 pt-4">
          {updateCardMutation.isError && (
            <p className="text-sm font-medium text-red-600">
              Error: {updateCardMutation.error.message}
            </p>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={!isFormDirty || isPending}
              className="flex items-center gap-2 rounded-xl border-2 border-black bg-blue-200 px-6 py-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {!isPending && <Save className="size-4" />}
              {updateCardMutation.isSuccess
                ? 'Saved!'
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export function AnimeCardEditor() {
  const [selectedCardId, setSelectedCardId] = React.useState<number | null>(
    null,
  );

  const {
    data: cards,
    isFetching,
    isError,
  } = api.animecard.getAllCards.useQuery();
  const selectedCard = cards?.find((m) => m.id === selectedCardId) ?? null;

  React.useEffect(() => {
    if (cards && cards.length > 0 && selectedCardId === null) {
      setSelectedCardId(cards[0]!.id);
    }
  }, [cards, selectedCardId]);

  if (isFetching) {
    return (
      <DashboardCard>
        <DashboardCardContent>
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="size-5 animate-spin" />
            <p className="font-medium">Loading anime cards...</p>
          </div>
        </DashboardCardContent>
      </DashboardCard>
    );
  }

  if (isError) {
    return (
      <DashboardAlert
        type="error"
        title="Error"
        message="Failed to load anime cards."
      />
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <DashboardAlert
        type="warning"
        title="No Cards"
        message="No anime cards found to edit."
      />
    );
  }

  return (
    <DashboardCard>
      <DashboardCardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border-2 border-black bg-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Tv className="size-5" />
          </div>
          <h3 className="text-xl font-bold">Edit Anime Cards</h3>
        </div>

        <div className="flex items-center gap-3">
          <Label
            htmlFor="title-select"
            className="font-bold whitespace-nowrap"
          >
            Select Card:
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="title-select"
                className={cn(
                  'flex min-w-[220px] items-center justify-between gap-2 px-4 py-3 text-left font-semibold border-2 border-black rounded-xl bg-white transition-all',
                  'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
                  'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
                  'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
                )}
              >
                <span
                  className={cn(
                    'truncate pr-4',
                    selectedCard
                      ? 'text-gray-900'
                      : 'text-gray-500',
                  )}
                >
                  {selectedCard
                    ? selectedCard.title
                    : 'Select a title'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
              {cards.map((card) => (
                <DropdownMenuItem
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  disabled={card.id === selectedCardId}
                  className="rounded-lg font-medium py-2.5 cursor-pointer"
                >
                  <Sparkles className="mr-2 size-4" />
                  <span className="truncate">
                    {card.title}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DashboardCardHeader>

      <DashboardCardContent>
        {selectedCard ? (
          <MemberEditorRow
            key={selectedCard.id}
            card={selectedCard}
            onSuccess={refetch}
          />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-black/30 bg-gray-50 p-6 text-center">
            <p className="font-medium text-gray-600">
              Please select a card to begin editing it.
            </p>
          </div>
        )}
      </DashboardCardContent>
    </DashboardCard>
  );
}
