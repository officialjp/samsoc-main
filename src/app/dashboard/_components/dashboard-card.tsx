import { cn } from '~/lib/utils';

interface DashboardCardProps {
	children: React.ReactNode;
	className?: string;
	variant?: 'default' | 'interactive' | 'form' | 'danger';
	padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantStyles = {
	default: 'bg-white',
	interactive:
		'bg-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer',
	form: 'bg-white',
	danger: 'bg-red-50 hover:bg-red-100',
};

const paddingStyles = {
	none: '',
	sm: 'p-4',
	md: 'p-6',
	lg: 'p-8',
};

export function DashboardCard({
	children,
	className,
	variant = 'default',
	padding = 'md',
}: DashboardCardProps) {
	return (
		<div
			className={cn(
				'border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all',
				variantStyles[variant],
				paddingStyles[padding],
				className,
			)}
		>
			{children}
		</div>
	);
}

interface DashboardCardHeaderProps {
	children: React.ReactNode;
	className?: string;
	icon?: React.ReactNode;
}

export function DashboardCardHeader({
	children,
	className,
	icon,
}: DashboardCardHeaderProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-3 pb-4 mb-4 border-b-2 border-black',
				className,
			)}
		>
			{icon && (
				<div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
					{icon}
				</div>
			)}
			<h3 className="text-xl font-bold text-gray-900">{children}</h3>
		</div>
	);
}

interface DashboardCardContentProps {
	children: React.ReactNode;
	className?: string;
}

export function DashboardCardContent({
	children,
	className,
}: DashboardCardContentProps) {
	return <div className={cn('space-y-4', className)}>{children}</div>;
}

interface DashboardCardFooterProps {
	children: React.ReactNode;
	className?: string;
}

export function DashboardCardFooter({
	children,
	className,
}: DashboardCardFooterProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-end gap-3 pt-4 mt-4 border-t-2 border-black',
				className,
			)}
		>
			{children}
		</div>
	);
}
