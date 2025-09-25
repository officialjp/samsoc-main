import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CommitteeMemberProps {
	name: string;
	position: string;
	image: string;
	year: string;
	className?: string;
	current?: boolean;
}

export function CommitteeMember({
	name,
	position,
	image,
	year,
	className,
	current = false,
}: CommitteeMemberProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center border-2 rounded-2xl border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
				current ? 'bg-about2' : 'bg-about3',
				className,
			)}
		>
			<div className="mt-1 px-3 py-1 text-sm font-bold mb-4 inline-block w-fit grow-0 whitespace-pre">
				{year}
			</div>
			<div className="relative mb-4">
				<div
					className={cn(
						'relative z-10 h-32 w-32 overflow-hidden rounded-full border-4 border-black',
						current ? 'bg-pink-300' : 'bg-cyan-300',
					)}
				>
					<Image
						src={image || '/placeholder.svg'}
						alt={name}
						fill
						className="object-cover"
					/>
				</div>
				{current && (
					<div className="absolute -top-2 -right-2 z-20 rounded-full bg-about3 px-2 py-1 text-xs font-bold border-2 border-black rotate-12">
						CURRENT
					</div>
				)}
			</div>
			<h3 className="text-xl font-bold">{name}</h3>
			<div className="mt-1 bg-about1 px-3 py-1 text-sm font-bold rounded-2xl border-2 border-black inline-block w-fit grow-0 whitespace-pre">
				{position}
			</div>
		</div>
	);
}
