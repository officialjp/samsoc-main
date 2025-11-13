import Image from 'next/image';
import { cn } from '~/lib/utils';

interface CommitteeProps {
	id: number;
	name: string;
	role: string;
	source: string | null;
	className?: string;
}

export function CommitteeCard({
	name,
	role,
	source,
	className,
}: CommitteeProps) {
	return (
		<div
			className={cn(
				'flex items-center sm:justify-start md:justify-center flex-row text-sm lg:flex-col w-full lg:w-fit',
				className,
			)}
		>
			<div className="relative lg:w-40 lg:h-40 md:w-24 md:h-24 w-16 h-16 lg:mb-2 mb-0 shrink-0 border-2 border-black rounded-full overflow-hidden bg-about1 box-content bg-[linear-gradient(to_top,#fff,#0a0a0a)]">
				<Image
					draggable={false}
					src={source ?? '/placeholder.svg'}
					alt={`${name} - ${role}`}
					fill
					sizes="(max-width: 640px) 150px, (max-width: 1024px) 180px, 200px"
					quality={85}
					loading="lazy"
					className="absolute object-cover transform-[scale(1.01)] block w-full h-full"
				/>
			</div>

			<span className="flex gap-2 lg:gap-0 text-sm justify-center items-center lg:flex-col flex-row lg:ml-0 ml-3 rounded-full bg-about2 lg:p-0 p-1 border-black border-2 lg:border-0 lg:bg-transparent">
				<p className="font-semibold">{name}</p>
				<span className="lg:hidden block text-gray-600 opacity-60">
					●
				</span>
				<p className="text-gray-600 text-xs sm:text-nowrap lg:text-wrap">
					{role}
				</p>
			</span>
		</div>
	);
}
