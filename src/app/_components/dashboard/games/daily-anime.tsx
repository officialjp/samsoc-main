'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Loader2, Save } from 'lucide-react';
import AnimeSearch from '../../games/search-component';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { toast } from 'sonner';

const adminSchema = z.object({
	animeId: z.number().int().min(1, 'Please search and select an anime'),
	scheduledDate: z.string(),
});

// The inner component that uses useSearchParams
function SchedulerContent() {
	const utils = api.useUtils();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [dateHasEntry, setDateHasEntry] = useState(false);

	const queryAnimeId = searchParams.get('animeId');

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			animeId: 0,
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	const scheduledDate = form.watch('scheduledDate');

	useEffect(() => {
		if (queryAnimeId) {
			form.setValue('animeId', parseInt(queryAnimeId));
		}
	}, [queryAnimeId, form]);

	// Check if the selected date already has an entry
	const { data: dateCheckResult } = api.anime.checkDateScheduled.useQuery(
		{ date: new Date(scheduledDate + 'T00:00:00Z') },
		{ enabled: !!scheduledDate },
	);

	useEffect(() => {
		setDateHasEntry(!!dateCheckResult?.hasSchedule);
	}, [dateCheckResult]);

	const scheduleMutation = api.anime.scheduleDaily.useMutation({
		onSuccess: () => {
			toast.success('Daily anime scheduled successfully!');
			void utils.anime.getAnswerAnime.invalidate();
			// Clear the search param from URL
			router.push(window.location.pathname);
			form.reset({
				animeId: 0,
				scheduledDate: new Date().toISOString().split('T')[0],
			});
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	});

	async function onSubmit(values: z.infer<typeof adminSchema>) {
		if (dateHasEntry) {
			toast.error('This date already has a scheduled anime.');
			return;
		}
		await scheduleMutation.mutateAsync({
			animeId: values.animeId,
			date: new Date(values.scheduledDate),
		});
	}

	const isPending = !!scheduleMutation.isPending;
	const isDisabled = isPending || !form.watch('animeId') || dateHasEntry;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
				>
					<h3 className="text-lg font-semibold border-b pb-2">
						Anime Scheduler
					</h3>

					<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
						<p className="text-blue-800">
							Search for an anime below. Its ID will be captured
							automatically.
						</p>
					</div>

					{/* Anime search component */}
					<AnimeSearch />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="animeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Selected ID</FormLabel>
									<FormControl>
										<Input
											type="number"
											readOnly
											{...field}
											className="bg-gray-100"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="scheduledDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Release Date</FormLabel>
									<FormControl>
										<Input
											type="date"
											{...field}
											className={
												dateHasEntry
													? 'border-red-500 bg-red-50'
													: ''
											}
										/>
									</FormControl>
									{dateHasEntry && (
										<FormDescription className="text-red-600 font-medium">
											This date already has a scheduled
											anime
										</FormDescription>
									)}
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="mt-4 flex justify-end">
						<Button type="submit" disabled={isDisabled}>
							{isPending ? (
								'Saving...'
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Schedule
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

// The main export that handles the Suspense bailout
export default function AdminAnimeScheduler() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center p-12 border rounded-lg shadow-md bg-white max-w-2xl mx-auto">
					<Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
					<p className="font-semibold text-center">
						Loading Admin Tools...
					</p>
				</div>
			}
		>
			<SchedulerContent />
		</Suspense>
	);
}
