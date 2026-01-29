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
import { FormDropzone } from '../../_components/form-dropzone';
import { useState } from 'react';
import { fileToBase64 } from '~/lib/utils';
import { Plus, Loader2, Layers } from 'lucide-react';
import { toast } from 'sonner';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';

const formSchema = z.object({
	alt: z.string().min(1, {
		message: 'Description must be at least 1 character long!',
	}),
	mobileImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
	pcImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
});

export default function CarouselForm() {
	const createItem = api.carousel.createItem.useMutation();
	const utils = api.useUtils();
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
			void utils.carousel.getAllItems.invalidate();

			toast.success(
				'Carousel item created and images uploaded successfully!',
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
					<DashboardCardHeader icon={<Layers className="w-5 h-5" />}>
						Add Carousel Item
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
											placeholder="Enter carousel description..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										A brief description of the carousel
										item.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="mobileImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Mobile Image
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
											Upload the image for mobile devices.
										</FormDescription>
										<FormMessage className="text-xs text-red-600 font-medium" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="pcImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-bold text-gray-900">
											Desktop Image
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
											Upload the image for desktop
											devices.
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
									<span>Add Carousel Item</span>
								</>
							)}
						</button>
					</DashboardCardFooter>
				</form>
			</DashboardCard>
		</Form>
	);
}
