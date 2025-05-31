import { EventCardPropsType } from "@/lib/definitions";
import SwipeRight from "@/public/hand-swipe-right.svg";
import Image from "next/image";

export function EventCard({
  date,
  title,
  description,
  location,
}: EventCardPropsType) {
  return (
    <div className="relative flex items-center border-2 rounded-md border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col space-y-2 w-full h-full">
        <div className="bg-about1 rounded-md px-3 py-1 text-sm font-bold inline-block border-2 border-black self-start">
          {date}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-text1">{description}</p>
        <p className="text-sm text-gray-500 mt-auto">📍 {location}</p>
      </div>
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
