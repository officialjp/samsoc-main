'use client';

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
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Plus, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '~/lib/utils';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from '../../_components/dashboard-card';
import {
	DashboardInput,
	DashboardSelect,
} from '../../_components/dashboard-form';

const colorOptions = [
	{ value: 'bg-pink-200', label: 'Pink', preview: 'bg-pink-200' },
	{ value: 'bg-cyan-200', label: 'Cyan', preview: 'bg-cyan-200' },
	{ value: 'bg-purple-200', label: 'Purple', preview: 'bg-purple-200' },
	{ value: 'bg-yellow-200', label: 'Yellow', preview: 'bg-yellow-200' },
	{ value: 'bg-green-200', label: 'Green', preview: 'bg-green-200' },
] as const;

const color = [
	'bg-pink-200',
	'bg-cyan-200',
	'bg-purple-200',
	'bg-yellow-200',
	'bg-green-200',
] as const;

const eventSchema = z.object({
	title: z.string().min(1, {
		message: 'Title is required!',
	}),
	description: z.string().nonempty('Description is required'),
	location: z.string().nonempty('Location is required'),
	date: z.date(),
	color: z.enum(color),
	is_regular_session: z.boolean(),
	session_count: z.number().nullable().optional(),
});

export default function EventAdd() {
	const utils = api.useUtils();
	const createItem = api.event.createItem.useMutation({
		onSuccess: () => {
			void utils.event.getAllItems.invalidate();
			toast.success('Event created successfully');
			form.reset();
		},
		onError: (error) => {
			toast.error(error.message || 'Failed to create event');
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof eventSchema>>({
		resolver: zodResolver(eventSchema),
		defaultValues: {
			title: '',
			description: '',
			location: '',
			date: new Date(),
			color: 'bg-pink-200',
			is_regular_session: false,
			session_count: 0,
		},
	});

	async function onSubmit(values: z.infer<typeof eventSchema>) {
		setIsSubmitting(true);
		try {
			await createItem.mutateAsync(values);
		} catch (error) {
			// Error is handled by onError callback
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<DashboardCard>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DashboardCardHeader
						icon={<Calendar className="w-5 h-5" />}
					>
						Add New Event
					</DashboardCardHeader>
					<DashboardCardContent className="space-y-5">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Title
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter event title..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The title for the event you are
										creating.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Description
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter event description..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										A description of the event.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Location
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter event location..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The location of the event.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Date & Time
										</FormLabel>
										<FormControl>
											<DashboardInput
												type="datetime-local"
												value={
													field.value instanceof Date
														? field.value
																.toISOString()
																.substring(
																	0,
																	16,
																)
														: ''
												}
												onChange={(e) =>
													field.onChange(
														new Date(
															e.target.value,
														),
													)
												}
												onBlur={field.onBlur}
												name={field.name}
											/>
										</FormControl>
										<FormDescription className="text-xs text-gray-500">
											When the event is scheduled.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="session_count"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Event Count
										</FormLabel>
										<FormControl>
											<DashboardInput
												type="number"
												min={0}
												placeholder="0"
												onChange={(e) =>
													field.onChange(
														e.target.value
															? Number(
																	e.target
																		.value,
																)
															: null,
													)
												}
												value={field.value ?? ''}
											/>
										</FormControl>
										<FormDescription className="text-xs text-gray-500">
											Number of times scheduled to run.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Event Color
									</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{colorOptions.map((option) => (
												<button
													key={option.value}
													type="button"
													onClick={() =>
														field.onChange(
															option.value,
														)
													}
													className={cn(
														'px-4 py-2 rounded-xl border-2 border-black font-bold text-sm transition-all',
														'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
														option.preview,
														field.value ===
															option.value
															? 'translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
															: 'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
													)}
												>
													{option.label}
												</button>
											))}
										</div>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										Choose a color for the event card.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="is_regular_session"
							render={({ field }) => (
								<FormItem>
									<div
										className={cn(
											'flex items-center gap-4 p-4 border-2 border-black rounded-xl transition-all cursor-pointer',
											'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
											field.value
												? 'bg-green-100'
												: 'bg-gray-50',
										)}
										onClick={() =>
											field.onChange(!field.value)
										}
									>
										<FormControl>
											<div
												className={cn(
													'w-6 h-6 border-2 border-black rounded-md flex items-center justify-center transition-colors',
													field.value
														? 'bg-green-500'
														: 'bg-white',
												)}
											>
												{field.value && (
													<svg
														className="w-4 h-4 text-white"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
										</FormControl>
										<div className="flex-1">
											<FormLabel className="text-sm font-bold text-gray-900 cursor-pointer">
												Regular Session
											</FormLabel>
											<FormDescription className="text-xs text-gray-500">
												Check if this is a recurring,
												regular session.
											</FormDescription>
										</div>
									</div>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
					</DashboardCardContent>
					<DashboardCardFooter>
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black rounded-xl transition-all bg-green-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Creating...</span>
								</>
							) : (
								<>
									<Plus className="h-4 w-4" />
									<span>Create Event</span>
								</>
							)}
						</button>
					</DashboardCardFooter>
				</form>
			</DashboardCard>
		</Form>
	);
}
