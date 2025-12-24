'use client';

import { Trophy } from 'lucide-react';

interface LeaderboardUser {
	id: string;
	name: string | null;
	wins: number;
	totalTries: number;
}

interface LeaderboardProps {
	users: LeaderboardUser[];
	gameType: 'wordle' | 'studio';
}

export default function Leaderboard({ users, gameType }: LeaderboardProps) {

	return (
		<div className="border-2 border-black rounded-2xl bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-8">
			<div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-4">
				<Trophy
					className="w-5 h-5 text-yellow-500"
					aria-hidden="true"
				/>
				<h2 className="text-xl font-bold uppercase tracking-tighter">
					Leaderboard
				</h2>
			</div>
			<div className="space-y-3" role="list" aria-label="Game leaderboard">
				{users.length === 0 ? (
					<p className="text-sm text-gray-500 text-center py-4">
						No players yet. Be the first!
					</p>
				) : (
					users.map((user, idx) => (
						<div
							key={user.id}
							className="flex justify-between items-center p-3 border-2 border-black rounded-lg bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
							role="listitem"
							aria-label={`${idx + 1}. ${user.name ?? 'Anonymous'}, ${user.wins} wins, ${user.totalTries} total tries`}
						>
							<div className="flex flex-col min-w-0">
								<span className="font-bold text-sm truncate">
									{idx + 1}. {user.name ?? 'Anon'}
								</span>
								<span className="text-[10px] text-gray-500 uppercase font-semibold">
									{user.totalTries} tries
								</span>
							</div>
							<div
								className="bg-black text-white px-2 py-1 rounded text-xs font-bold shrink-0"
								aria-label={`${user.wins} wins`}
							>
								{user.wins}W
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

