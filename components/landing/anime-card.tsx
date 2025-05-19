import SwipeRight from "@/public/hand-swipe-right.svg";
import Image from "next/image";

interface AnimeCardProps {
  title: string;
  episode: string;
  description: string;
  image: string;
}

export function AnimeCard({
  title,
  episode,
  description,
  image,
}: AnimeCardProps) {
  return (
    <div className="flex flex-col items-center space-y-3 p-4 border-2 rounded-md border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          width={180}
          height={250}
          alt={title}
          className="object-cover border-2 border-black"
        />
      </div>

      <h3 className="text-xl font-bold">{title}</h3>
      <div className="bg-about1 rounded-md px-3 py-1 text-sm font-bold inline-block border-2 border-black">
        {episode}
      </div>
      <p className="text-sm text-text1 text-center mt-auto">{description}</p>
      <Image
        alt="icon"
        className="lg:hidden absolute bottom-1 right-1"
        src={SwipeRight}
        height={20}
        width={20}
      />
    </div>
  );
}
