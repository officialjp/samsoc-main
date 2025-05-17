import Image from "next/image";
import { cn } from "@/lib/utils";

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

export function MangaCard({
  id,
  title,
  author,
  volume,
  coverImage,
  genre,
  isAvailable,
  borrowedBy,
}: MangaCardProps) {
  return (
    <div className="border-2 rounded-md border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden h-full flex flex-col">
      <div className="relative">
        {/* Status badge */}
        <div
          className={cn(
            "absolute top-2 right-2 px-3 py-1 text-sm font-bold border-2 border-black z-10",
            isAvailable ? "bg-green-300" : "bg-red-300"
          )}
        >
          {isAvailable ? "Available" : "Borrowed"}
        </div>

        {/* Cover image */}
        <div className="relative h-64 border-b-4 border-black">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={`${title} Volume ${volume} cover`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">Vol. {volume}</p>
        <p className="text-sm mb-2">by {author}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {genre.map((g) => (
            <span
              key={g}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200"
            >
              {g}
            </span>
          ))}
        </div>

        {!isAvailable && borrowedBy && (
          <div className="mt-auto pt-3 border-t border-gray-200">
            <p
              className={cn(
                "text-xs",
                isAvailable ? "text-gray-500" : "text-red-500"
              )}
            >
              Borrowed by: {borrowedBy}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
