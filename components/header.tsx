import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="#" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-yellow-400 px-2 py-1 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Surrey Anime and Manga
          </span>
          <span className="hidden sm:inline">Society</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#about"
            className="font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="#events"
            className="font-medium hover:underline underline-offset-4"
          >
            Events
          </Link>
          <Link
            href="#gallery"
            className="font-medium hover:underline underline-offset-4"
          >
            Gallery
          </Link>
          <Link
            href="#join"
            className="font-medium hover:underline underline-offset-4"
          >
            Join Us
          </Link>
        </nav>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Join Now
        </Button>
      </div>
    </header>
  );
}
