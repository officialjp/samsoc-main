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
import { Building2, Info, Loader2 } from 'lucide-react';
import StudioSearch from '../../games/studio-search';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
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

	const queryStudioName = searchParams.get('studioName');

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			studioName: queryStudioName ?? '',
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

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
		await scheduleMutation.mutateAsync({
			studioName: values.studioName,
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
						<Building2 className="w-8 h-8" /> Studio Scheduler
					</h2>

					<div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-xl flex gap-3">
						<Info className="w-5 h-5 text-purple-600 shrink-0" />
						<p className="text-sm text-purple-800 font-medium">
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
									<FormLabel className="font-bold uppercase text-xs">
										Selected Studio
									</FormLabel>
									<FormControl>
										<Input
											readOnly
											{...field}
											placeholder="Select a studio above..."
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
						disabled={isPending || !form.watch('studioName')}
						className="w-full bg-green-400 hover:bg-green-500 text-black border-2 border-black font-black py-6 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
					>
						{isPending ? 'SCHEDULING...' : 'SAVE STUDIO DAILY'}
					</Button>
				</form>
			</Form>
		</div>
	);
}

export default function AdminStudioScheduler() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col items-center justify-center p-12 border-4 border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">
					<Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
					<p className="font-black uppercase italic text-center">
						Loading Studio Tools...
					</p>
				</div>
			}
		>
			<StudioSchedulerContent />
		</Suspense>
	);
}
