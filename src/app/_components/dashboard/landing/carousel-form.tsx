'use client';

import { useState } from 'react';
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

export default function CarouselForm() {
	const [id, setId] = useState(1);

	const {
		data: carouselResult,
		isLoading: isLoadingNames,
		error: errorNames,
	} = api.post.getCarouselIdAndName.useQuery();

	const {
		data: itemResult,
		isLoading: isLoadingItem,
		error: errorItem,
	} = api.post.getCarouselItem.useQuery({ id: id });

	const itemData = itemResult?.data;

	const formSchema = z.object({
		id: z.number().min(1, {
			message: 'ID must be at least 1!',
		}),
		alt: z.string().min(1, {
			message: 'Description must be at least 1 character long!',
		}),
		mobileSource: z.string(),
		desktopSource: z.string(),
		order: z.number().min(1, {
			message: 'Order must be at least 1',
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: itemData?.id,
			alt: itemData?.alt,
			mobileSource: itemData?.mobileSource,
			desktopSource: itemData?.desktopSource,
			order: itemData?.order,
		},
	});

	if (isLoadingNames || isLoadingItem) {
		return <div>Loading item...</div>;
	}

	if (errorNames || errorItem) {
		const error = errorNames || errorItem;
		return <div>Error fetching data: {error?.message}</div>;
	}

	if (!carouselResult || !itemResult) {
		return <div>No data found...</div>;
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<h3 className="text-lg font-semibold">
					Editing Carousel Item {itemData?.id}
				</h3>
				<FormField
					control={form.control}
					name="id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>ID</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									onChange={(e) =>
										field.onChange(Number(e.target.value))
									}
								/>
							</FormControl>
							<FormDescription>
								The unique identifier for the carousel item.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="alt"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								A brief description of the carousel item.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit Changes</Button>
			</form>
		</Form>
	);
}
