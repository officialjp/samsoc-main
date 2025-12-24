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
import { toast } from 'sonner';

const formSchema = z.object({
	alt: z.string().min(1, {
		message: 'Description must be at least 1 character long!',
	}),
	mobileImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
	pcImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
});

export default function CarouselForm() {
	const createItem = api.carousel.createItem.useMutation();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			alt: '',
			mobileImage: [],
			pcImage: [],
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			const mobileImageBase64 = await fileToBase64(
				values.mobileImage[0]!,
			);
			const pcImageBase64 = await fileToBase64(values.pcImage[0]!);

			const input = {
				alt: values.alt,
				order: 0,
				mobileImage: {
					base64: mobileImageBase64,
					fileName: values.mobileImage[0]!.name,
					mimeType: values.mobileImage[0]!.type,
				},
				pcImage: {
					base64: pcImageBase64,
					fileName: values.pcImage[0]!.name,
					mimeType: values.pcImage[0]!.type,
				},
			};

			await createItem.mutateAsync(input);

			toast.success('Carousel item created and images uploaded successfully!');

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
				className="space-y-4 flex-col p-6 border rounded-lg shadow-md bg-white"
			>
				<h3 className="text-lg font-semibold border-b pb-2">
					Adding Carousel Item
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
					name="mobileImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Mobile Image</FormLabel>
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
								Upload the image for mobile devices.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pcImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>PC Image</FormLabel>
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
								Upload the image for desktop devices.
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
