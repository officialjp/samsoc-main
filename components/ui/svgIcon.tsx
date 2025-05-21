import { cn } from '@/lib/utils';

function SvgIcon({ className, src, height, width }: React.ComponentProps<any>) {
	return (
		<span
			className={cn(
				'mask-no-repeat mask-center block relative',
				className,
			)}
			style={{
				height: `${height}px`,
				width: `${width}px`,
				maskImage: `url(${src})`,
			}}
		></span>
	);
}

export { SvgIcon };
