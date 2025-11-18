'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Save, XCircle, ChevronDown, User } from 'lucide-react';
import Image from 'next/image';

import { api } from '~/trpc/react';

import { Button } from '~/app/_components/ui/button';
import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/app/_components/ui/dropzone';
import { Input } from '~/app/_components/ui/input';
import { Label } from '~/app/_components/ui/label';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '~/app/_components/ui/form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/app/_components/ui/dropdown-menu';

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
		<div className="relative size-24 shrink-0 overflow-hidden rounded-md border-2 border-border">
			<Image
				src={src}
				alt="Member Image Preview"
				fill
				style={{ objectFit: 'cover' }}
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
		// NOTE: defaultValues is now guaranteed to match the current member due to the 'key' prop on the parent
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
			// Reset the form with the new, updated data from the server
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
				className="flex flex-col gap-4 rounded-base border-2 border-border bg-main p-6 shadow-shadow"
			>
				<div className="flex items-start gap-6">
					<div className="flex w-full max-w-xs flex-col gap-2 shrink-0">
						<Label>Member Image</Label>
						<ImagePreview file={newImageFile} url={member.source} />

						<FormField
							control={form.control}
							name="newImage"
							render={({ field }) => (
								<FormItem className="mt-2">
									<FormControl>
										<Dropzone
											accept={{
												'image/jpeg': ['.jpg', '.jpeg'],
												'image/png': ['.png'],
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
									<FormMessage />
								</FormItem>
							)}
						/>
						{newImageFile && (
							<Button
								variant="outline"
								size="sm"
								className="w-full"
								type="button"
								onClick={() =>
									form.setValue('newImage', undefined, {
										shouldDirty: true,
									})
								}
							>
								<XCircle className="size-4" />
								Remove Image
							</Button>
						)}
					</div>

					<div className="flex grow flex-col gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter full name"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter role/position"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						type="submit"
						disabled={!isFormDirty || isPending}
						variant="default"
					>
						{isPending && <Loader2 className="animate-spin" />}
						{updateMemberMutation.isSuccess
							? 'Saved!'
							: 'Save Changes'}
						{!isPending && !updateMemberMutation.isSuccess && (
							<Save />
						)}
					</Button>
				</div>
				{updateMemberMutation.isError && (
					<p className="mt-2 text-sm text-red-500">
						Error: {updateMemberMutation.error.message}
					</p>
				)}
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
		return <p className="p-6">Loading committee members...</p>;
	}

	if (isError) {
		return (
			<p className="p-6 text-red-500">
				Failed to load committee members.
			</p>
		);
	}

	if (!members || members.length === 0) {
		return <p className="p-6">No committee members found to edit.</p>;
	}

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-heading">Edit Committee Members</h2>

			<div className="flex items-center gap-4">
				<Label htmlFor="member-select">Select Member:</Label>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							id="member-select"
							className="min-w-[200px] justify-between"
						>
							{selectedMember
								? selectedMember.name
								: 'Select a Member'}
							<ChevronDown className="ml-2 size-4 opacity-50" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[200px]">
						{members.map((member) => (
							<DropdownMenuItem
								key={member.id}
								onClick={() => setSelectedMemberId(member.id)}
								disabled={member.id === selectedMemberId}
							>
								<User className="mr-2 size-4" />
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
				<p className="p-4 text-base font-base">
					Please select a committee member to begin editing their
					details.
				</p>
			)}
		</div>
	);
}
