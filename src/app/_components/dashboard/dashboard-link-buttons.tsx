'use client';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function DashButtons() {
	const pathname = usePathname();
	const dashPages = ['calendar', 'gallery', 'landing', 'library', 'games'];

	return (
		<div className="flex gap-3 mb-5 flex-wrap mt-3">
			{dashPages
				.filter(
					(item) =>
						item !== pathname.slice(pathname.lastIndexOf('/') + 1),
				)
				.map((item, index) => {
					return (
						<Button
							key={item + index}
							asChild
							className="hover:cursor-pointer bg-button2 hover:bg-button1 cursor-pointer grow"
						>
							<Link href={'/dashboard/' + item}>
								{item.slice(0, 1).toUpperCase() +
									item.slice(1) +
									' dashboard'}
							</Link>
						</Button>
					);
				})}
		</div>
	);
}
