import { EventCardPropsType } from "@/lib/definitions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useIsMobile from "../mobile-check";

export function EventCard({
  id,
  date,
  title,
  description,
  location,
}: EventCardPropsType) {
  return (
    <div className="relative flex items-center border-2 rounded-md border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {useIsMobile() && id != 0 && (
        <ChevronLeft className="absolute text-gray-500 -left-2 top-1/2 -translate-y-1/2" />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className="bg-about1 rounded-md px-3 py-1 text-sm font-bold inline-block border-2 border-black self-start">
          {date}
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-text1">{description}</p>
        <p className="text-sm text-gray-500">📍 {location}</p>
      </div>
      {useIsMobile() && id != 3 && (
        <ChevronRight className="absolute text-gray-500 -right-2 top-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}
