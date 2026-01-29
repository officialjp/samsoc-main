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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
	title: z.string().min(1),
	author: z.string().min(1),
	volume: z.number().int().min(1),
	borrowed_by: z.string().optional(),
	sourceImage: z.array(z.instanceof(File)).min(1, 'Please upload an image.'),
});

export default function MangaAdd() {
	const createItem = api.manga.createItem.useMutation();
	const utils = api.useUtils();
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
			void utils.manga.getAllItems.invalidate();

			toast.success(
				'Manga item created and images uploaded successfully!',
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
					<DashboardCardHeader icon={<Plus className="w-5 h-5" />}>
						Add Library Item
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
											placeholder="Enter manga title..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The name of the manga.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="sourceImage"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Display Image
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
										Upload the image for the cover of the
										manga.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Author
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter author name..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The author of the manga.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="volume"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Volume
									</FormLabel>
									<FormControl>
										<DashboardInput
											type="number"
											min={1}
											{...field}
											onChange={(e) =>
												field.onChange(
													parseInt(e.target.value) ||
														1,
												)
											}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The volume of the manga.
									</FormDescription>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="borrowed_by"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Borrowed By
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter borrower name (optional)..."
											{...field}
										/>
									</FormControl>
									<FormDescription className="text-xs text-gray-500">
										The person that has borrowed the manga
										(can be empty).
									</FormDescription>
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
									<span>Create Entry</span>
								</>
							)}
						</button>
					</DashboardCardFooter>
				</form>
			</DashboardCard>
		</Form>
	);
}
