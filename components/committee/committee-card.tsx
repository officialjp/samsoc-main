import Image from "next/image";
import { cn } from "@/lib/utils";

interface CommitteeMemberProps {
  name: string;
  position: string;
  image: string;
  quote?: string;
  className?: string;
  current?: boolean;
}

export function CommitteeMember({
  name,
  position,
  image,
  quote,
  className,
  current = false,
}: CommitteeMemberProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border-2 rounded-md border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        current ? "bg-yellow-100" : "bg-white",
        className
      )}
    >
      <div className="relative mb-4">
        <div
          className={cn(
            "absolute -inset-1 rounded-full border-4 border-black",
            current ? "bg-pink-300 -rotate-3" : "bg-cyan-300 rotate-3"
          )}
        ></div>
        <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border-4 border-black">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        {current && (
          <div className="absolute -top-2 -right-2 z-20 rounded-full bg-yellow-300 px-2 py-1 text-xs font-bold border-2 border-black rotate-12">
            CURRENT
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-1 inline-block bg-cyan-300 px-3 py-1 text-sm font-bold border-2 border-black">
        {position}
      </div>
      {quote && (
        <p className="mt-4 text-center text-gray-700 italic">"{quote}"</p>
      )}
    </div>
  );
}
