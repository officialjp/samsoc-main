'use client';

import { UploadIcon, FileImage, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import { cn } from '~/lib/utils';

type DropzoneContextType = {
	src?: File[];
	accept?: DropzoneOptions['accept'];
	maxSize?: DropzoneOptions['maxSize'];
	minSize?: DropzoneOptions['minSize'];
	maxFiles?: DropzoneOptions['maxFiles'];
};

const renderBytes = (bytes: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)}${units[unitIndex]}`;
};

const DropzoneContext = createContext<DropzoneContextType | undefined>(
	undefined,
);

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
	src?: File[];
	className?: string;
	onDrop?: (
		acceptedFiles: File[],
		fileRejections: FileRejection[],
		event: DropEvent,
	) => void;
	children?: ReactNode;
};

export const Dropzone = ({
	accept,
	maxFiles = 1,
	maxSize,
	minSize,
	onDrop,
	onError,
	disabled,
	src,
	className,
	children,
	...props
}: DropzoneProps) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept,
		maxFiles,
		maxSize,
		minSize,
		onError,
		disabled,
		onDrop: (acceptedFiles, fileRejections, event) => {
			if (fileRejections.length > 0) {
				const message = fileRejections.at(0)?.errors.at(0)?.message;
				onError?.(new Error(message));
				return;
			}

			onDrop?.(acceptedFiles, fileRejections, event);
		},
		...props,
	});

	return (
		<DropzoneContext.Provider
			key={JSON.stringify(src)}
			value={{ src, accept, maxSize, minSize, maxFiles }}
		>
			<button
				type="button"
				className={cn(
					'relative w-full flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-black bg-gray-50 transition-all cursor-pointer',
					'hover:bg-gray-100 hover:border-solid',
					isDragActive &&
						'bg-purple-50 border-solid border-purple-600 shadow-[4px_4px_0px_0px_rgba(147,51,234,0.3)]',
					disabled &&
						'opacity-50 cursor-not-allowed hover:bg-gray-50',
					className,
				)}
				disabled={disabled}
				{...getRootProps()}
			>
				<input {...getInputProps()} disabled={disabled} />
				{children}
			</button>
		</DropzoneContext.Provider>
	);
};

const useDropzoneContext = () => {
	const context = useContext(DropzoneContext);

	if (!context) {
		throw new Error('useDropzoneContext must be used within a Dropzone');
	}

	return context;
};

export type DropzoneContentProps = {
	children?: ReactNode;
	className?: string;
};

const maxLabelItems = 3;

export const DropzoneContent = ({
	children,
	className,
}: DropzoneContentProps) => {
	const { src } = useDropzoneContext();

	if (!src || src.length === 0) {
		return null;
	}

	if (children) {
		return children;
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-3',
				className,
			)}
		>
			<div className="w-12 h-12 bg-green-100 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
				<FileImage className="w-6 h-6 text-green-700" />
			</div>
			<div className="text-center">
				<p className="font-bold text-gray-900 text-sm mb-1">
					{src.length === 1
						? src[0]?.name
						: `${src.length} files selected`}
				</p>
				{src.length > 1 && src.length <= maxLabelItems && (
					<p className="text-xs text-gray-600">
						{new Intl.ListFormat('en').format(
							src.map((file) => file.name),
						)}
					</p>
				)}
				{src.length > maxLabelItems && (
					<p className="text-xs text-gray-600">
						{new Intl.ListFormat('en').format(
							src
								.slice(0, maxLabelItems)
								.map((file) => file.name),
						)}{' '}
						and {src.length - maxLabelItems} more
					</p>
				)}
			</div>
			<p className="text-xs text-gray-500 font-medium">
				Click or drag to replace
			</p>
		</div>
	);
};

export type DropzoneEmptyStateProps = {
	children?: ReactNode;
	className?: string;
};

export const DropzoneEmptyState = ({
	children,
	className,
}: DropzoneEmptyStateProps) => {
	const { src, accept, maxSize, minSize, maxFiles } = useDropzoneContext();

	if (src && src.length > 0) {
		return null;
	}

	if (children) {
		return children;
	}

	let caption = '';

	if (accept) {
		caption += 'Accepts ';
		caption += new Intl.ListFormat('en').format(Object.keys(accept));
	}

	if (minSize && maxSize) {
		caption += ` between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`;
	} else if (minSize) {
		caption += ` at least ${renderBytes(minSize)}`;
	} else if (maxSize) {
		caption += ` less than ${renderBytes(maxSize)}`;
	}

	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center gap-3',
				className,
			)}
		>
			<div className="w-12 h-12 bg-purple-100 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
				<UploadIcon className="w-6 h-6 text-purple-700" />
			</div>
			<div className="text-center">
				<p className="font-bold text-gray-900 text-sm mb-1">
					Upload{' '}
					{maxFiles === 1 ? 'a file' : `up to ${maxFiles} files`}
				</p>
				<p className="text-xs text-gray-600">
					Drag and drop or click to browse
				</p>
			</div>
			{caption && (
				<p className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 font-medium">
					{caption}
				</p>
			)}
		</div>
	);
};
