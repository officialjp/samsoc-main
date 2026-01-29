'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, XCircle, ChevronDown, User, Users } from 'lucide-react';
import Image from 'next/image';

import { api } from '~/trpc/react';
import { revalidateHomePage } from '~/server/actions/revalidate';
import { cn } from '~/lib/utils';

import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/components/ui/dropzone';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/components/ui/form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
} from '../../_components/dashboard-card';
import { DashboardInput } from '../../_components/dashboard-form';
import {
	DashboardAlert,
	DashboardEmptyState,
} from '../../_components/dashboard-alert';

interface CommitteeMember {
	id: number;
	name: string;
	role: string;
	source: string | null;
}

const memberFormSchema = z.object({
	id: z.number(),
	name: z.string().min(1, 'Name is required.'),
	role: z.string().min(1, 'Role is required.'),
	currentSource: z.string().nullable().optional(),
	newImage: z
		.custom<File>((val) => val instanceof File || val === undefined, {
			message: 'Image must be a valid file.',
		})
		.optional(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;

const ImagePreview = ({
	file,
	url,
}: {
	file: File | undefined;
	url: string | null | undefined;
}) => {
	const src = file ? URL.createObjectURL(file) : url;

	if (!src) return null;

	return (
		<div className="relative w-28 h-28 overflow-hidden rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
			<Image
				src={src}
				alt="Member Image Preview"
				fill
				className="object-cover"
				unoptimized={!!file}
			/>
		</div>
	);
};

interface MemberEditorRowProps {
	member: CommitteeMember;
	onSuccess: () => void;
}

const MemberEditorRow: React.FC<MemberEditorRowProps> = ({
	member,
	onSuccess,
}) => {
	const form = useForm<MemberFormValues>({
		resolver: zodResolver(memberFormSchema),
		defaultValues: {
			id: member.id,
			name: member.name,
			role: member.role,
			currentSource: member.source,
			newImage: undefined,
		},
		mode: 'onChange',
	});

	const newImageFile = useWatch({ control: form.control, name: 'newImage' });
	const isFormDirty = form.formState.isDirty || !!newImageFile;

	const updateMemberMutation = api.committee.updateMember.useMutation({
		onSuccess: (updatedMember) => {
			onSuccess();
			void revalidateHomePage();
			form.reset({
				id: updatedMember.id,
				name: updatedMember.name,
				role: updatedMember.role,
				currentSource: updatedMember.source,
				newImage: undefined,
			});
		},
	});

	const onSubmit = (data: MemberFormValues) => {
		if (!isFormDirty) return;

		if (data.newImage) {
			const file = data.newImage;
			const reader = new FileReader();

			reader.onloadend = () => {
				if (typeof reader.result === 'string') {
					const newImagePayload = {
						base64: reader.result,
						fileName: file.name,
						mimeType: file.type,
					};

					updateMemberMutation.mutate({
						id: data.id,
						name: data.name !== member.name ? data.name : undefined,
						role: data.role !== member.role ? data.role : undefined,
						newImage: newImagePayload,
					});
				}
			};
			reader.readAsDataURL(file);
		} else {
			const name = data.name !== member.name ? data.name : undefined;
			const role = data.role !== member.role ? data.role : undefined;

			if (name || role) {
				updateMemberMutation.mutate({ id: data.id, name, role });
			}
		}
	};

	const isPending = updateMemberMutation.isPending;

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
			>
				<div className="flex flex-col lg:flex-row items-start gap-6">
					<div className="flex w-full lg:w-auto flex-col gap-4 shrink-0">
						<label className="text-sm font-bold text-gray-900">
							Member Image
						</label>
						<div className="flex justify-center">
							<ImagePreview
								file={newImageFile}
								url={member.source}
							/>
						</div>

						<FormField
							control={form.control}
							name="newImage"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Dropzone
											accept={{
												'image/avif': ['.avif'],
											}}
											maxSize={1024 * 1024 * 10}
											minSize={1024}
											maxFiles={1}
											onDrop={(acceptedFiles) => {
												field.onChange(
													acceptedFiles[0],
												);
											}}
											src={
												field.value ? [field.value] : []
											}
											disabled={isPending}
										>
											<DropzoneContent />
											<DropzoneEmptyState />
										</Dropzone>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						{newImageFile && (
							<button
								type="button"
								onClick={() =>
									form.setValue('newImage', undefined, {
										shouldDirty: true,
									})
								}
								className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black rounded-xl bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
							>
								<XCircle className="w-4 h-4" />
								Remove Image
							</button>
						)}
					</div>

					<div className="flex-1 w-full space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Name
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter full name"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-bold text-gray-900">
										Role
									</FormLabel>
									<FormControl>
										<DashboardInput
											placeholder="Enter role/position"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-600 font-medium" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="mt-6 pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
					{updateMemberMutation.isError && (
						<DashboardAlert
							type="error"
							message={updateMemberMutation.error.message}
							className="flex-1"
						/>
					)}
					<div className="flex-1" />
					<button
						type="submit"
						disabled={!isFormDirty || isPending}
						className={cn(
							'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black rounded-xl transition-all',
							'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
							'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
							updateMemberMutation.isSuccess
								? 'bg-green-200 hover:bg-green-300'
								: 'bg-blue-200 hover:bg-blue-300',
							'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
						)}
					>
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Saving...</span>
							</>
						) : updateMemberMutation.isSuccess ? (
							<>
								<Save className="w-4 h-4" />
								<span>Saved!</span>
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								<span>Save Changes</span>
							</>
						)}
					</button>
				</div>
			</form>
		</Form>
	);
};

export function CommitteeMemberEditor() {
	const [selectedMemberId, setSelectedMemberId] = React.useState<
		number | null
	>(null);
	const utils = api.useUtils();

	const {
		data: members,
		isFetching,
		isError,
	} = api.committee.getAllMembers.useQuery();

	const refetch = () => {
		void utils.committee.getAllMembers.invalidate();
	};

	const selectedMember =
		members?.find((m) => m.id === selectedMemberId) ?? null;

	React.useEffect(() => {
		if (members && members.length > 0 && selectedMemberId === null) {
			setSelectedMemberId(members[0]!.id);
		}
	}, [members, selectedMemberId]);

	if (isFetching) {
		return (
			<DashboardCard>
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-3 text-gray-600">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="font-semibold">
							Loading committee members...
						</span>
					</div>
				</div>
			</DashboardCard>
		);
	}

	if (isError) {
		return (
			<DashboardCard>
				<DashboardAlert
					type="error"
					title="Error"
					message="Failed to load committee members. Please try again."
				/>
			</DashboardCard>
		);
	}

	if (!members || members.length === 0) {
		return (
			<DashboardCard>
				<DashboardEmptyState
					icon={<Users className="w-12 h-12" />}
					title="No committee members found"
					description="There are no committee members to edit."
				/>
			</DashboardCard>
		);
	}

	return (
		<DashboardCard>
			<DashboardCardHeader icon={<Users className="w-5 h-5" />}>
				Edit Committee Members
			</DashboardCardHeader>
			<DashboardCardContent className="space-y-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
					<label
						htmlFor="member-select"
						className="text-sm font-bold text-gray-900 shrink-0"
					>
						Select Member:
					</label>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								id="member-select"
								className={cn(
									'flex-1 w-full flex items-center justify-between px-4 py-3 text-left font-semibold border-2 border-black rounded-xl bg-white transition-all',
									'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
									'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
									'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
								)}
							>
								<span className="truncate pr-4 text-gray-900">
									{selectedMember
										? selectedMember.name
										: 'Select a Member'}
								</span>
								<ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2">
							{members.map((member) => (
								<DropdownMenuItem
									key={member.id}
									onClick={() =>
										setSelectedMemberId(member.id)
									}
									disabled={member.id === selectedMemberId}
									className="rounded-lg font-medium py-2.5 cursor-pointer"
								>
									<User className="mr-2 w-4 h-4" />
									{member.name}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{selectedMember ? (
					<MemberEditorRow
						key={selectedMember.id}
						member={selectedMember}
						onSuccess={refetch}
					/>
				) : (
					<DashboardEmptyState
						icon={<User className="w-10 h-10" />}
						title="Select a member"
						description="Please select a committee member to begin editing their details."
					/>
				)}
			</DashboardCardContent>
		</DashboardCard>
	);
}
