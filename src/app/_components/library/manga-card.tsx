import Image from 'next/image';

interface MangaData {
	id: number;
	title: string;
	source: string;
	author: string;
	borrowed_by: string | null;
	volume: number;
	genres: string[];
}

interface MangaCardProps {
	manga: MangaData;
}

export default function MangaCard({ manga }: MangaCardProps) {
	const isAvailable = !manga.borrowed_by || manga.borrowed_by === 'NULL';
	const hasBorrower = manga.borrowed_by && manga.borrowed_by !== 'NULL';

	return (
		<article className="flex flex-row items-center rounded-2xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
			<div className="relative mr-4 h-48 w-32 shrink-0 border-2 border-black">
				<Image
					src={manga.source}
					alt={`${manga.title} Volume ${manga.volume} cover`}
					fill
					className="object-cover"
					sizes="128px"
					loading="lazy"
					unoptimized={true}
				/>
			</div>

			<div className="flex-1">
				<h2 className="mb-1 text-xl font-bold tracking-tight text-gray-900">
					{manga.title}
				</h2>
				<p className="mb-2 text-sm text-gray-700">
					Vol. {manga.volume} by {manga.author}
				</p>

				{manga.genres.length > 0 && (
					<div className="mb-3 flex flex-wrap gap-2">
						{manga.genres.map((genre) => (
							<span
								key={genre}
								className="rounded-full border border-gray-300 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-900"
							>
								{genre}
							</span>
						))}
					</div>
				)}

				{hasBorrower ? (
					<p className="text-sm text-gray-500">
						Borrowed by: {manga.borrowed_by}
					</p>
				) : isAvailable ? (
					<p className="text-sm font-medium text-green-600">
						Available
					</p>
				) : (
					<p className="text-sm font-medium text-red-600">
						Unavailable
					</p>
				)}
			</div>
		</article>
	);
}
