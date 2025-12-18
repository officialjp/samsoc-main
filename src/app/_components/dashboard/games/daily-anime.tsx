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
import { Calendar, Save } from 'lucide-react';

const adminSchema = z.object({
	animeId: z.number().int().min(1),
	scheduledDate: z.string(), // Format YYYY-MM-DD
});

export default function AdminAnimeScheduler() {
	const utils = api.useUtils();
	const scheduleMutation = api.anime.scheduleDaily.useMutation({
		onSuccess: () => {
			alert('Daily anime scheduled successfully!');
			void utils.anime.getAnswerAnime.invalidate();
		},
	});

	const form = useForm<z.infer<typeof adminSchema>>({
		resolver: zodResolver(adminSchema),
		defaultValues: {
			animeId: 0,
			scheduledDate: new Date().toISOString().split('T')[0],
		},
	});

	async function onSubmit(values: z.infer<typeof adminSchema>) {
		await scheduleMutation.mutateAsync({
			animeId: values.animeId,
			date: new Date(values.scheduledDate),
		});
	}
	const isPending = !!scheduleMutation.isPending;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 p-6 border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
			>
				<h2 className="text-2xl font-black uppercase italic flex items-center gap-2">
					<Calendar className="w-6 h-6" /> Schedule Daily Anime
				</h2>

				<FormField
					control={form.control}
					name="animeId"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="font-bold">
								Anime ID
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(parseInt(e.target.value))
									}
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
							<FormLabel className="font-bold">
								Date to Appear
							</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					disabled={isPending}
					className="w-full bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
				>
					{isPending ? (
						'Scheduling...'
					) : (
						<span className="flex items-center gap-2">
							SAVE SCHEDULE <Save className="w-4 h-4" />
						</span>
					)}
				</Button>
			</form>
		</Form>
	);
}
