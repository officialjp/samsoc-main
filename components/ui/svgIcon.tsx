import { cn } from '@/lib/utils';

interface SvgIconProps {
	className: string;
	width: number;
	height: number;
	src: string;
}

function SvgIcon({ className, height, width, src }: SvgIconProps) {
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
