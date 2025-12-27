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
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import StudioSearch from '~/app/games/_components/studio-search';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';

const adminSchema = z.object({
	studioId: z.number().int().min(1, 'Please search and select a studio'),
	studioName: z.string().min(1, 'Studio selection is required'),
	scheduledDate: z.string(),
});

function StudioSchedulerContent() {
	const utils = api.useUtils();
	const router = useRouter();
	const pathname = usePathname();
	const [dateHasEntry, setDateHasEntry] = useState(false);

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			studioId: 0,
			studioName: '',
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	const scheduledDate = form.watch('scheduledDate');

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
			router.push(pathname);
			form.reset({
				studioId: 0,
				studioName: '',
				scheduledDate: new Date().toISOString().split('T')[0],
			});
		},
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	});

	const handleStudioSelect = (selection: { id: string; name: string }) => {
		form.setValue('studioId', parseInt(selection.id));
		form.setValue('studioName', selection.name);
	};

	async function onSubmit(values: z.infer<typeof adminSchema>) {
		if (dateHasEntry) {
			toast.error('This date already has a scheduled studio.');
			return;
		}
		await scheduleMutation.mutateAsync({
			studioId: values.studioId,
			date: new Date(values.scheduledDate),
		});
	}

	const isPending = !!scheduleMutation.isPending;
	const isDisabled = isPending || !form.watch('studioId') || dateHasEntry;

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
											Already scheduled
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
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
								<Save className="w-4 h-4 mr-2" />
							)}
							Save Studio Daily
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

export default function AdminStudioScheduler() {
	return (
		<Suspense fallback={<Loader2 className="animate-spin" />}>
			<StudioSchedulerContent />
		</Suspense>
	);
}
