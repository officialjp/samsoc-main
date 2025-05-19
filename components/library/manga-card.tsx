import React from "react";
import Image from "next/image";

interface MangaCardProps {
  id: string;
  title: string;
  author: string;
  volume: number;
  coverImage: string;
  genre: string[];
  isAvailable: boolean;
  borrowedBy?: string;
}

const MangaCard: React.FC<MangaCardProps> = ({
  id,
  title,
  author,
  volume,
  coverImage,
  genre,
  isAvailable,
  borrowedBy,
}) => {
  return (
    <div className="bg-white rounded-md p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-row items-center border-2 border-black">
      <div className="mr-4 h-48 w-32 relative border-2 border-black">
        <Image
          src={coverImage || "/placeholder.svg"}
          alt={`${title} Volume ${volume} cover`}
          fill
          className="object-contain"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
          {title}
        </h2>
        <p className="text-sm text-gray-700 mb-2">
          Vol. {volume} by {author}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {genre.map((g) => (
            <span
              key={g}
              className="text-xs font-semibold bg-gray-100 text-gray-900 px-2 py-1 rounded-sm border border-gray-300"
            >
              {g}
            </span>
          ))}
        </div>
        {borrowedBy !== "NULL" && borrowedBy && (
          <p className="text-sm text-gray-500">Borrowed by: {borrowedBy}</p>
        )}
        {!isAvailable && !borrowedBy && (
          <p className="text-sm text-red-500">Unavailable</p>
        )}
        {isAvailable && <p className="text-sm text-green-500">Available</p>}
      </div>
    </div>
  );
};

export default MangaCard;
