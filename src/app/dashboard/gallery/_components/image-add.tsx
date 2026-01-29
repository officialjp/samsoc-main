'use client';

import { api } from '~/trpc/react';
import { revalidateGalleryPage } from '~/server/actions/revalidate';
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
import { fileToBase64, cn } from '~/lib/utils';
import { Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FormDropzone } from '../../_components/form-dropzone';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';

const categoryOptions = [
	{ value: 'Events', label: 'Events' },
	{ value: 'Collaborations', label: 'Collaborations' },
] as const;

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
	const utils = api.useUtils();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			year: new Date().getFullYear(),
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
			void utils.image.getAllItems.invalidate();
			void revalidateGalleryPage();

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
			<DashboardCard>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DashboardCardHeader
						icon={<ImageIcon className="w-5 h-5" />}
					>
						Add Gallery Image
					</DashboardCardHeader>
					<DashboardCardContent className="space-y-5">
						<FormField
							control={form.control}
							name="alt"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Description
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter image description..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										A brief description of the image.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="sourceImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Full Image
										</FormLabel>
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
										<FormDescription className="text-xs text-gray-500">
											Upload the full-size image.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="thumbnailImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Thumbnail Image
										</FormLabel>
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
										<FormDescription className="text-xs text-gray-500">
											Upload the thumbnail image.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Category
										</FormLabel>
										<FormControl>
											<div className="flex gap-2">
												{categoryOptions.map(
													(option) => (
														<button
															key={option.value}
															type="button"
															onClick={() =>
																field.onChange(
																	option.value,
																)
															}
															className={cn(
																'flex-1 px-4 py-3 rounded-xl border-2 border-black font-bold text-sm transition-all',
																'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
																field.value ===
																	option.value
																	? 'bg-purple-200 translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
																	: 'bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
															)}
														>
															{option.label}
														</button>
													),
												)}
											</div>
										</FormControl>
										<FormDescription className="text-xs text-gray-500">
											The category of the image.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="year"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Year
										</FormLabel>
										<FormControl>
											<DashboardInput
												type="number"
												min={2000}
												max={2100}
												{...field}
												onChange={(e) =>
													field.onChange(
														parseInt(
															e.target.value,
														) || 0,
													)
												}
											/>
										</FormControl>
										<FormDescription className="text-xs text-gray-500">
											The year the image was taken.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
						</div>
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
									<span>Uploading...</span>
								</>
							) : (
								<>
									<Plus className="h-4 w-4" />
									<span>Add Image</span>
								</>
							)}
						</button>
					</DashboardCardFooter>
				</form>
			</DashboardCard>
		</Form>
	);
}
