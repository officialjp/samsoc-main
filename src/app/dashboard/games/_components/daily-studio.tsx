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
import { Loader2, Save, Calendar, Building2 } from 'lucide-react';
import StudioSearch from '~/app/games/_components/studio-search';
import { useRouter, usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';

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
		<DashboardCard>
			<DashboardCardHeader>
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl border-2 border-black bg-blue-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
						<Building2 className="size-5" />
					</div>
					<h3 className="text-xl font-bold">Studio Scheduler</h3>
				</div>
			</DashboardCardHeader>

			<DashboardCardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{/* Studio search component */}
						<div className="rounded-xl border-2 border-black/20 bg-gray-50 p-4">
							<StudioSearch onSelect={handleStudioSelect} />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="studioName"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="font-bold">
											Selected Studio
										</FormLabel>
										<FormControl>
											<DashboardInput
												readOnly
												{...field}
												className="bg-gray-100"
												placeholder="Select a studio above"
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
												Already scheduled
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
								Save Studio Daily
							</button>
						</div>
					</form>
				</Form>
			</DashboardCardContent>
		</DashboardCard>
	);
}

export default function AdminStudioScheduler() {
	return (
		<Suspense
			fallback={
				<DashboardCard>
					<DashboardCardContent>
						<div className="flex flex-col items-center justify-center py-12">
							<Loader2 className="size-10 animate-spin text-blue-600 mb-4" />
							<p className="font-bold text-center">
								Loading Studio Scheduler...
							</p>
						</div>
					</DashboardCardContent>
				</DashboardCard>
			}
		>
			<StudioSchedulerContent />
		</Suspense>
	);
}
