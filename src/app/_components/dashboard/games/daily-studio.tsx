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
import StudioSearch from '../../games/studio-search';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

const adminSchema = z.object({
	studioName: z.string().min(1, 'Please search and select a studio'),
	scheduledDate: z.string(),
});

function StudioSchedulerContent() {
	const utils = api.useUtils();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [dateHasEntry, setDateHasEntry] = useState(false);

	const queryStudioName = searchParams.get('studioName');

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			studioName: queryStudioName ?? '',
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	const scheduledDate = form.watch('scheduledDate');

	// Check if the selected date already has an entry
	const { data: dateCheckResult } = api.studio.checkDateScheduled.useQuery(
		{ date: new Date(scheduledDate + 'T00:00:00Z') },
		{ enabled: !!scheduledDate },
	);

	useEffect(() => {
		setDateHasEntry(!!dateCheckResult?.hasSchedule);
	}, [dateCheckResult]);

	const scheduleMutation = api.studio.scheduleDaily.useMutation({
		onSuccess: () => {
			toast.success('Daily studio scheduled successfully!');
			void utils.studio.getAnswerStudio.invalidate();
			// Clear URL and Reset form
			router.push(pathname);
			form.reset({
				studioName: '',
				scheduledDate: new Date().toISOString().split('T')[0],
			});
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	});

	// Handle selection from the Search Component
	const handleStudioSelect = (name: string) => {
		form.setValue('studioName', name);
		// Optional: Sync to URL so refreshes don't lose the selection
		const params = new URLSearchParams(searchParams);
		params.set('studioName', name);
		router.replace(`${pathname}?${params.toString()}`);
	};

	async function onSubmit(values: z.infer<typeof adminSchema>) {
		if (dateHasEntry) {
			toast.error('This date already has a scheduled studio.');
			return;
		}
		await scheduleMutation.mutateAsync({
			studioName: values.studioName,
			date: new Date(values.scheduledDate),
		});
	}

	const isPending = !!scheduleMutation.isPending;
	const isDisabled = isPending || !form.watch('studioName') || dateHasEntry;

	return (
		<div className="max-w-2xl mx-auto p-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
				>
					<h3 className="text-lg font-semibold border-b pb-2">
						Studio Scheduler
					</h3>

					<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
						<p className="text-blue-800">
							Search for a production studio below. The selection
							will update the field below.
						</p>
					</div>

					{/* Pass the handler to the search component */}
					<StudioSearch onSelect={handleStudioSelect} />

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="studioName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Selected Studio</FormLabel>
									<FormControl>
										<Input
											readOnly
											{...field}
											placeholder="Select a studio above..."
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
											studio
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
								'Scheduling...'
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Studio Daily
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

export default function AdminStudioScheduler() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center p-12 border rounded-lg shadow-md bg-white max-w-2xl mx-auto">
					<Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
					<p className="font-semibold text-center">
						Loading Studio Tools...
					</p>
				</div>
			}
		>
			<StudioSchedulerContent />
		</Suspense>
	);
}
