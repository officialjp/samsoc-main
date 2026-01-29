import { cn } from '~/lib/utils';
import {
	DashboardCard,
	DashboardCardHeader,
	DashboardCardContent,
	DashboardCardFooter,
} from './dashboard-card';
import { Loader2 } from 'lucide-react';

interface DashboardFormProps {
	children: React.ReactNode;
	title: string;
	icon?: React.ReactNode;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	submitLabel?: string;
	isSubmitting?: boolean;
	submitIcon?: React.ReactNode;
	className?: string;
}

export function DashboardForm({
	children,
	title,
	icon,
	onSubmit,
	submitLabel = 'Save Changes',
	isSubmitting = false,
	submitIcon,
	className,
}: DashboardFormProps) {
	return (
		<DashboardCard className={className}>
			<form onSubmit={onSubmit}>
				<DashboardCardHeader icon={icon}>{title}</DashboardCardHeader>
				<DashboardCardContent>{children}</DashboardCardContent>
				<DashboardCardFooter>
					<button
						type="submit"
						disabled={isSubmitting}
						className={cn(
							'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black rounded-xl transition-all',
							'bg-purple-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
							'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-300',
							'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
						)}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Saving...</span>
							</>
						) : (
							<>
								{submitIcon}
								<span>{submitLabel}</span>
							</>
						)}
					</button>
				</DashboardCardFooter>
			</form>
		</DashboardCard>
	);
}

interface DashboardFormFieldProps {
	label: string;
	description?: string;
	error?: string;
	children: React.ReactNode;
	className?: string;
	required?: boolean;
}

export function DashboardFormField({
	label,
	description,
	error,
	children,
	className,
	required,
}: DashboardFormFieldProps) {
	return (
		<div className={cn('space-y-2', className)}>
			<label className="block text-sm font-bold text-gray-900">
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>
			{children}
			{description && !error && (
				<p className="text-xs text-gray-500">{description}</p>
			)}
			{error && (
				<p className="text-xs text-red-600 font-medium">{error}</p>
			)}
		</div>
	);
}

interface DashboardInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
}

export function DashboardInput({ className, ...props }: DashboardInputProps) {
	return (
		<input
			className={cn(
				'w-full px-4 py-3 rounded-xl bg-white text-gray-900 border-2 border-black font-medium text-sm',
				'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
				'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
				'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
				'transition-all placeholder:text-gray-400',
				'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
				className,
			)}
			{...props}
		/>
	);
}

interface DashboardTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
}

export function DashboardTextarea({
	className,
	...props
}: DashboardTextareaProps) {
	return (
		<textarea
			className={cn(
				'w-full px-4 py-3 rounded-xl bg-white text-gray-900 border-2 border-black font-medium text-sm',
				'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
				'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
				'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
				'transition-all placeholder:text-gray-400 resize-none',
				'disabled:opacity-50 disabled:cursor-not-allowed',
				className,
			)}
			{...props}
		/>
	);
}

interface DashboardSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	className?: string;
}

export function DashboardSelect({
	className,
	children,
	...props
}: DashboardSelectProps) {
	return (
		<select
			className={cn(
				'w-full px-4 py-3 rounded-xl bg-white text-gray-900 border-2 border-black font-medium text-sm',
				'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2',
				'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
				'hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5',
				'transition-all cursor-pointer',
				'disabled:opacity-50 disabled:cursor-not-allowed',
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
