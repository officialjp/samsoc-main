'use client';

import type {
	ControllerRenderProps,
	FieldValues,
	FieldPath,
} from 'react-hook-form';

import {
	Dropzone,
	DropzoneContent,
	DropzoneEmptyState,
} from '~/components/ui/dropzone';
import type { DropzoneProps } from '~/components/ui/dropzone';

interface FormDropzoneProps<
	DFieldValues extends FieldValues,
	TName extends FieldPath<DFieldValues>,
> {
	field: ControllerRenderProps<DFieldValues, TName>;
	options?: Omit<DropzoneProps, 'onDrop' | 'src'>;
}

export function FormDropzone<
	DFieldValues extends FieldValues,
	TName extends FieldPath<DFieldValues>,
>({ field, options }: FormDropzoneProps<DFieldValues, TName>) {
	const handleDrop = (acceptedFiles: File[]) => {
		field.onChange(acceptedFiles);
	};

	const files = (field.value as File[] | undefined) ?? [];

	return (
		<Dropzone
			onDrop={handleDrop}
			src={files}
			maxFiles={options?.maxFiles ?? 1}
			maxSize={options?.maxSize}
			accept={options?.accept}
			className={options?.className}
			disabled={field.disabled}
			{...options}
			{...field}
		>
			<DropzoneContent />
			<DropzoneEmptyState />
		</Dropzone>
	);
}
