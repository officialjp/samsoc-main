import { cn } from '~/lib/utils';

interface SectionHeadingProps {
	badge: string;
	title: string;
	description?: string;
	badgeColor?: string;
	className?: string;
}

export function SectionHeading({
	badge,
	title,
	description,
	badgeColor = 'bg-yellow-300',
	className,
}: SectionHeadingProps) {
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center space-y-4 text-center',
				className,
			)}
		>
			<div className="space-y-2">
				<div
					className={cn(
						'inline-block rounded-full px-3 py-1 text-sm border-2 border-black',
						badgeColor,
					)}
				>
					{badge}
				</div>
				<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
					{...title.split(' ').map((word, index) => {
						return (
							<span key={index} className={``}>
								{word}{' '}
							</span>
						);
					})}
				</h2>
				{description && (
					<p className="max-w-[900px] text-text1 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						{...description.split(' ').map((word, index) => {
							return (
								<span key={index} className={``}>
									{word}{' '}
								</span>
							);
						})}
					</p>
				)}
			</div>
		</div>
	);
}
