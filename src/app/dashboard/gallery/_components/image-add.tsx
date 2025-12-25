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
import { Input } from '~/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { useState } from 'react';
import { fileToBase64 } from '~/lib/utils';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { FormDropzone } from '../../_components/form-dropzone';

const category = ['Events', 'Collaborations'] as const;

const formSchema = z.object({
	alt: z.string().min(1, {
		message: 'Description must be at least 1 character long!',
	}),
	category: z.enum(category),
	year: z.number(),
	sourceImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
	thumbnailImage: z
		.array(z.instanceof(File))
		.min(1, 'Please upload an image.'),
});

export default function ImageAdd() {
	const createItem = api.image.createItem.useMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			year: 0,
			category: 'Events',
			alt: '',
			sourceImage: [],
			thumbnailImage: [],
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const sourceImageBase64 = await fileToBase64(
				values.sourceImage[0]!,
			);
			const thumbnailImageBase64 = await fileToBase64(
				values.thumbnailImage[0]!,
			);

			const input = {
				alt: values.alt,
				year: values.year,
				category: values.category,
				sourceImage: {
					base64: sourceImageBase64,
					fileName: values.sourceImage[0]!.name,
					mimeType: values.sourceImage[0]!.type,
				},
				thumbnailImage: {
					base64: thumbnailImageBase64,
					fileName: values.thumbnailImage[0]!.name,
					mimeType: values.thumbnailImage[0]!.type,
				},
			};

			await createItem.mutateAsync(input);

			toast.success(
				'Image item created and images uploaded successfully!',
			);

			form.reset();
		} catch (error) {
			const errorMessage =
				createItem.error?.message ??
				'An error occurred during submission and file upload.';
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 p-6 border rounded-lg shadow-md bg-white"
			>
				<h3 className="text-lg font-semibold border-b pb-2">
					Adding Image Item
				</h3>
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
				<FormField
					control={form.control}
					name="sourceImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display Image</FormLabel>
							<FormControl>
								<FormDropzone
									field={field}
									options={{
										maxFiles: 1,
										accept: {
											'image/avif': ['.avif'],
										},
									}}
								/>
							</FormControl>
							<FormDescription>
								Upload the image for inside the component.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="thumbnailImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Thumbnail Image</FormLabel>
							<FormControl>
								<FormDropzone
									field={field}
									options={{
										maxFiles: 1,
										accept: {
											'image/avif': ['.avif'],
										},
									}}
								/>
							</FormControl>
							<FormDescription>
								Upload the image for the thumbnail.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The category of the image.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="year"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Year</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormDescription>
								The year the image was taken.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="mt-4 flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							'Uploading & Creating...'
						) : (
							<>
								Save Changes <Save />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
