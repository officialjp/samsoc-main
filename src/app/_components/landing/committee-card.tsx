import Image from 'next/image';
import { cn } from '~/lib/utils';

interface CommitteeProps {
	id: number;
	name: string;
	role: string;
	source: string | null;
	className: string;
}

export function CommitteeCard({
	id,
	name,
	role,
	source,
	className,
}: CommitteeProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-center flex-col text-sm',
				className,
			)}
		>
			<Image
				draggable={false}
				src={source ?? '/placeholder.svg'}
				alt={id.toString()}
				width={200}
				height={200}
				loading="lazy"
			/>
			<p>{name}</p>
			<p>{role}</p>
		</div>
	);
}
