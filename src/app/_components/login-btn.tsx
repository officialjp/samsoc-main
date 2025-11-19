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
				<div className="relative w-10 h-10 flex items-center justify-center font-bold rounded-full overflow-hidden shrink-0 shadow-[0,0,0px_#000000ff] hover:shadow-[0_0_10px_#00000040] active:shadow-[0_0_4px_#000000a0] hover:scale-110 active:duration-50 active:scale-105 transition duration-300">
					<Image
						alt={session.user.id}
						src={session.user.image ?? 'placeholder.svg'}
						width={40}
						height={40}
						className="absolute shrink-0 w-full h-full"
						draggable={false}
					></Image>
				</div>
			</div>
		);
	}
	return (
		<div className="flex flex-row justify-center items-center gap-2">
			<p>Not signed in?</p>
			<button
				className="bg-button2 hover:bg-button1 text-white py-1 px-4 rounded-3xl hover:cursor-pointer"
				onClick={() => signIn('discord')}
			>
				Sign in
			</button>
		</div>
	);
}
