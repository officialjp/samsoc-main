import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface Diag {
	description: string;
	buttonName: string;
	content: Array<string>;
	title: string;
}

export default function DialogWithStickyFooter({
	description,
	buttonName,
	content,
	title,
}: Diag) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="hover:cursor-pointer bg-button2 hover:bg-button1">
					{buttonName}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						{description}
						<br />
					</DialogDescription>
				</DialogHeader>
				<div className="-mx-6 max-h-[500px] overflow-y-auto px-6 text-sm">
					{content.map((value, index) => {
						return (
							<p key={index} className="mb-4 leading-normal">
								{value}
								<br />
							</p>
						);
					})}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button className="hover:cursor-pointer bg-button2 hover:bg-button1">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
