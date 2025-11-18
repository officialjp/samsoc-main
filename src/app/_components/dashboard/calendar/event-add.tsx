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
} from '../../ui/form';
import { Input } from '../../ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import { useState } from 'react';

const color = ['bg-pink-200', 'bg-blue-200'] as const;

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
	const createItem = api.event.createItem.useMutation();
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

			console.log('Event item created successfully!');

			form.reset();
		} catch (error) {
			console.error('Submission failed:', error);
			const errorMessage =
				createItem.error?.message ??
				'An error occurred during submission.';
			console.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-6 max-w-lg mx-auto rounded-xl space-y-6"
			>
				<h3 className="text-2xl font-bold text-center text-gray-800">
					Add New Event
				</h3>

				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The title for the event you are creating.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								A description of the event.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Location</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The location of the event.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="session_count"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Event Count</FormLabel>
							<FormControl>
								<Input
									type="number"
									onChange={(e) =>
										field.onChange(
											e.target.value
												? Number(e.target.value)
												: null,
										)
									}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormDescription>
								The number of times the event is scheduled to
								run.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<Input
									type="datetime-local"
									value={
										field.value instanceof Date
											? field.value
													.toISOString()
													.substring(0, 16)
											: ''
									}
									onChange={(e) =>
										field.onChange(new Date(e.target.value))
									}
									onBlur={field.onBlur}
									name={field.name}
								/>
							</FormControl>
							<FormDescription>
								When the event is scheduled to run (Date and
								Time).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Color Class</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The Tailwind CSS class for the color (e.g.,
								bg-pink-200).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="is_regular_session"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
							<FormControl>
								<Input
									type="checkbox"
									checked={field.value}
									onChange={(e) =>
										field.onChange(e.target.checked)
									}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>Regular Session</FormLabel>
								<FormDescription>
									Check if this is a recurring, regular
									session.
								</FormDescription>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit Event'}
				</Button>
			</form>
		</Form>
	);
}
