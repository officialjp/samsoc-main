import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AccountButton() {
	const { data: session } = useSession();
	if (session) {
		return (
			<div className="flex flex-row justify-center items-center gap-2">
				<button
					className="bg-button2 hover:bg-button1 text-white py-1 px-4 rounded-3xl text-nowrap hover:cursor-pointer"
					onClick={() => signOut()}
				>
					Sign out
				</button>
				<Image
					alt={session.user.id}
					src={session.user.image ?? 'placeholder.svg'}
					width={45}
					height={45}
					className="rounded-full border-2"
					draggable={false}
				></Image>
			</div>
		);
	}
	return (
		<div className="flex flex-row justify-center items-center gap-2">
			<p>Not signed in?</p>
			<button
				className="bg-button2 hover:bg-button1 text-white py-1 px-4 rounded-3xl hover:cursor-pointer"
				onClick={() => signIn()}
			>
				Sign in
			</button>
		</div>
	);
}
