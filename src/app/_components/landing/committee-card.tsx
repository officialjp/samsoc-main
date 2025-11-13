import { memo } from 'react';
import Image from 'next/image';
import { cn } from '~/lib/utils';

interface CommitteeProps {
	id: number;
	name: string;
	role: string;
	source: string | null;
	className?: string;
}

export const CommitteeCard = memo(function CommitteeCard({
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
			<div className="relative w-[200px] h-[200px]">
				<Image
					draggable={false}
					src={source ?? '/placeholder.svg'}
					alt={`${name} - ${role}`}
					fill
					sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 200px"
					quality={85}
					loading="lazy"
					className="object-cover rounded-full"
				/>
			</div>
			<p className="mt-2 font-semibold">{name}</p>
			<p className="text-gray-600">{role}</p>
		</div>
	);
});
