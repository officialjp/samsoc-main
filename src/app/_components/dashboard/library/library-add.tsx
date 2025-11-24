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
import { FormDropzone } from '../form-dropzone';
import { useState } from 'react';
import { fileToBase64 } from '~/lib/utils';
import { Save } from 'lucide-react';

const formSchema = z.object({
	title: z.string().min(1),
	author: z.string().min(1),
	volume: z.number().int().min(1),
	borrowed_by: z.string().optional(),
	sourceImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
});

export default function MangaAdd() {
	const createItem = api.manga.createItem.useMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			author: '',
			volume: 1,
			borrowed_by: '',
			sourceImage: [],
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const sourceImageBase64 = await fileToBase64(
				values.sourceImage[0]!,
			);

			const input = {
				title: values.title,
				author: values.author,
				volume: values.volume,
				borrowed_by: values.borrowed_by,
				sourceImage: {
					base64: sourceImageBase64,
					fileName: values.sourceImage[0]!.name,
					mimeType: values.sourceImage[0]!.type,
				},
			};

			await createItem.mutateAsync(input);

			alert('Mangaa item created and images uploaded successfully!');

			form.reset();
		} catch (error) {
			console.error('Submission failed:', error);
			const errorMessage =
				createItem.error?.message ??
				'An error occurred during submission and file upload.';
			alert(errorMessage);
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
					Adding Library Item
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
								The name of the manga.
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
								Upload the image for the cover of the manga.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="author"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Author</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The author of the manga.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="volume"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Volume</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
							<FormDescription>
								The volume of the manga.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="borrowed_by"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Borrowed By</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription>
								The person that has borrowed the manga (can be
								empty).
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
