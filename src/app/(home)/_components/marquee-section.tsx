'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Logo from '../../../../public/images/logo.webp';
import { SvgIcon } from '~/components/shared/svg-icon';

const Marquee = dynamic(() => import('react-fast-marquee'), {
	ssr: false,
	loading: () => <div className="mt-20 h-[70px]" />,
});

const DEVELOPERS = ['J.P', 'Michael', 'Maiham', 'David'];

function MarqueeContent() {
	return (
		<div className="mr-10 flex items-center gap-10">
			<span className="flex items-center gap-2">
				<p>Developed by:</p>
				<p>{DEVELOPERS.join(', ')}</p>
			</span>
			<span>●</span>
			<span className="flex items-center gap-2">
				<p>A community for students at</p>
				<div className="relative block h-fit w-fit px-2">
					<SvgIcon
						className="bg-black"
						height={50}
						width={130}
						src="/surrey.svg"
					/>
				</div>
			</span>
			<span>●</span>
			<span className="flex items-center gap-2">
				<p>Made with love for</p>
				<div className="relative mx-2 block h-fit w-[50px]">
					<Image
						src={Logo}
						height={50}
						width={50}
						alt="samsoc logo"
					/>
				</div>
			</span>
			<span>●</span>
		</div>
	);
}

export default function MarqueeSection() {
	return (
		<Marquee
			autoFill
			className="mt-20 mask-[linear-gradient(90deg,hsla(0,0%,0%,0)_0%,hsla(0,0%,0%,1)_10%,hsla(0,0%,0%,1)_90%,hsla(0,0%,0%,0)_100%)]"
		>
			<MarqueeContent />
		</Marquee>
	);
}
