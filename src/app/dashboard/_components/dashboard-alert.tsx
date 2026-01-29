import { cn } from '~/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface DashboardAlertProps {
	type: AlertType;
	title?: string;
	message: string;
	onDismiss?: () => void;
	className?: string;
}

const alertStyles: Record<
	AlertType,
	{ bg: string; border: string; icon: React.ReactNode }
> = {
	success: {
		bg: 'bg-green-50',
		border: 'border-green-600',
		icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
	},
	error: {
		bg: 'bg-red-50',
		border: 'border-red-600',
		icon: <XCircle className="w-5 h-5 text-red-600" />,
	},
	warning: {
		bg: 'bg-yellow-50',
		border: 'border-yellow-600',
		icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
	},
	info: {
		bg: 'bg-blue-50',
		border: 'border-blue-600',
		icon: <Info className="w-5 h-5 text-blue-600" />,
	},
};

export function DashboardAlert({
	type,
	title,
	message,
	onDismiss,
	className,
}: DashboardAlertProps) {
	const styles = alertStyles[type];

	return (
		<div
			role="alert"
			className={cn(
				'flex items-start gap-3 p-4 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
				styles.bg,
				className,
			)}
		>
			<div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
			<div className="flex-1 min-w-0">
				{title && (
					<p className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">
						{title}
					</p>
				)}
				<p className="text-gray-800 text-sm">{message}</p>
			</div>
			{onDismiss && (
				<button
					onClick={onDismiss}
					className="flex-shrink-0 p-1 hover:bg-black/10 rounded-lg transition-colors"
					aria-label="Dismiss alert"
				>
					<X className="w-4 h-4 text-gray-600" />
				</button>
			)}
		</div>
	);
}

interface DashboardStatusBadgeProps {
	type: AlertType;
	children: React.ReactNode;
	className?: string;
}

const badgeStyles: Record<AlertType, string> = {
	success: 'bg-green-100 text-green-800 border-green-600',
	error: 'bg-red-100 text-red-800 border-red-600',
	warning: 'bg-yellow-100 text-yellow-800 border-yellow-600',
	info: 'bg-blue-100 text-blue-800 border-blue-600',
};

export function DashboardStatusBadge({
	type,
	children,
	className,
}: DashboardStatusBadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wide border-2 rounded-full',
				badgeStyles[type],
				className,
			)}
		>
			{children}
		</span>
	);
}

interface DashboardEmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: React.ReactNode;
	className?: string;
}

export function DashboardEmptyState({
	icon,
	title,
	description,
	action,
	className,
}: DashboardEmptyStateProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center py-12 px-6 text-center',
				className,
			)}
		>
			{icon && (
				<div className="w-16 h-16 mb-4 flex items-center justify-center text-gray-400">
					{icon}
				</div>
			)}
			<h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
			{description && (
				<p className="text-gray-600 text-sm max-w-sm mb-4">
					{description}
				</p>
			)}
			{action}
		</div>
	);
}
