'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import { Loader2, Save, Calendar, Sparkles, Info } from 'lucide-react';
import AnimeSearch, {
	type AnimeSelection,
} from '~/app/games/_components/anime-search';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';

const adminSchema = z.object({
	animeId: z.number().int().min(1, 'Please search and select an anime'),
	scheduledDate: z.string(),
});

// The inner component
function SchedulerContent() {
	const utils = api.useUtils();
	const router = useRouter();
	const [dateHasEntry, setDateHasEntry] = useState(false);

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			animeId: 0,
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	const scheduledDate = form.watch('scheduledDate');

	const handleAnimeSelect = (selection: AnimeSelection) => {
		form.setValue('animeId', parseInt(selection.id));
	};

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
		<DashboardCard>
			<DashboardCardHeader>
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border-2 border-black bg-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
						<Sparkles className="size-5" />
					</div>
					<h3 className="text-xl font-bold">Anime Scheduler</h3>
				</div>
			</DashboardCardHeader>

			<DashboardCardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Info box */}
						<div className="flex items-start gap-3 rounded-xl border-2 border-blue-400 bg-blue-50 p-4">
							<Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
							<p className="text-sm text-blue-800 font-medium">
								Search for an anime below. Its ID will be
								captured automatically.
							</p>
						</div>

						{/* Anime search component */}
						<div className="rounded-xl border-2 border-black/20 bg-gray-50 p-4">
							<AnimeSearch onSelect={handleAnimeSelect} />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="animeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-bold">
											Selected ID
										</FormLabel>
										<FormControl>
											<DashboardInput
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
										<FormLabel className="font-bold flex items-center gap-2">
											<Calendar className="size-4" />
											Release Date
										</FormLabel>
										<FormControl>
											<DashboardInput
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
												This date already has a
												scheduled anime
											</FormDescription>
										)}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end pt-4 border-t-2 border-black/10">
							<button
								type="submit"
								disabled={isDisabled}
								className="flex items-center gap-2 rounded-xl border-2 border-black bg-green-200 px-6 py-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
							>
								{isPending ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Save className="size-4" />
								)}
								Save Schedule
							</button>
						</div>
					</form>
				</Form>
			</DashboardCardContent>
		</DashboardCard>
	);
}

// The main export that handles the Suspense bailout
export default function AdminAnimeScheduler() {
	return (
		<Suspense
			fallback={
				<DashboardCard>
					<DashboardCardContent>
						<div className="flex flex-col items-center justify-center py-12">
							<Loader2 className="size-10 animate-spin text-purple-600 mb-4" />
							<p className="font-bold text-center">
								Loading Admin Tools...
							</p>
						</div>
					</DashboardCardContent>
				</DashboardCard>
			}
		>
			<SchedulerContent />
		</Suspense>
	);
}
