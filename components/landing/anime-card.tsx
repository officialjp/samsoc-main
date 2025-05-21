import ExternalLink from '@/public/external-link.svg';
import Image from 'next/image';
import { SvgIcon } from '@/components/ui/svgIcon';

interface AnimeCardProps {
	title: string;
	episode: string;
	description: string;
	image: string;
	url: string;
}

export function AnimeCard({
	title,
	episode,
	description,
	image,
	url,
}: AnimeCardProps) {
	return (
		<div className="flex flex-col items-center space-y-3 p-4 border-2 rounded-md border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[100%] grow">
			<div className="relative shrink-0 w-[180px] h-[250px] overflow-hidden border-2 border-black">
				<Image
					src={image || '/placeholder.svg'}
					width={180}
					height={250}
					alt={title}
					className="object-cover w-full h-full"
				/>
			</div>

			<h3 className="text-xl font-bold shrink-0">{title}</h3>
			<div className="bg-about1 rounded-md px-3 py-1 text-sm font-bold inline-block border-2 border-black">
				{episode}
			</div>
			<div className="mt-[10px] grow overflow-hidden text-clip shrink-0 block">
				<p className="text-sm text-text1 text-center float-left max-h-full">
					{description}
				</p>
			</div>

			<section className="relative shrink-0 grow mt-auto w-full flex items-end overflow-hidden">
				<a
					href={url}
					className="relative w-full flex items-center ml-auto"
				>
					<SvgIcon
						src={ExternalLink.src}
						className="bg-black mr-[7px]"
						width={15}
						height={15}
					></SvgIcon>
					<p className="text-xs">View on MAL</p>
				</a>
			</section>
		</div>
	);
}
