'use client';

import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '~/trpc/react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Calendar, Info, Loader2 } from 'lucide-react';
import AnimeSearch from '../../games/search-component';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
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
	const queryAnimeId = searchParams.get('animeId');

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

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			animeId: 0,
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	useEffect(() => {
		if (queryAnimeId) {
			form.setValue('animeId', parseInt(queryAnimeId));
		}
	}, [queryAnimeId, form]);

	async function onSubmit(values: z.infer<typeof adminSchema>) {
		await scheduleMutation.mutateAsync({
			animeId: values.animeId,
			date: new Date(values.scheduledDate),
		});
	}

	const isPending = !!scheduleMutation.isPending;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6 p-6 border-4 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
				>
					<h2 className="text-3xl font-black uppercase italic flex items-center gap-3">
						<Calendar className="w-8 h-8" /> Scheduler
					</h2>

					<div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl flex gap-3">
						<Info className="w-5 h-5 text-blue-600 shrink-0" />
						<p className="text-sm text-blue-800 font-medium">
							Search for an anime below. Its ID will be captured
							automatically.
						</p>
					</div>

					{/* Untouched original component */}
					<AnimeSearch />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="animeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-bold uppercase text-xs">
										Selected ID
									</FormLabel>
									<FormControl>
										<Input
											type="number"
											readOnly
											{...field}
											className="bg-gray-100 border-2 border-black font-bold h-12"
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
									<FormLabel className="font-bold uppercase text-xs">
										Release Date
									</FormLabel>
									<FormControl>
										<Input
											type="date"
											{...field}
											className="border-2 border-black font-bold h-12"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						disabled={isPending || !form.watch('animeId')}
						className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black font-black py-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
					>
						{isPending ? 'SAVING...' : 'SAVE SCHEDULE'}
					</Button>
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
				<div className="flex flex-col items-center justify-center p-12 border-4 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">
					<Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
					<p className="font-black uppercase italic">
						Loading Admin Tools...
					</p>
				</div>
			}
		>
			<SchedulerContent />
		</Suspense>
	);
}
