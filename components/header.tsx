"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-linear-65 from-red-500 to-pink-500 px-2 py-1 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Surrey Anime and Manga
          </span>
          <span className="hidden sm:inline">Society</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 ml-auto pr-6">
          <Link
            href="/library"
            className="font-medium hover:underline underline-offset-4"
          >
            Library
          </Link>
          <Link
            href="/events"
            className="font-medium hover:underline underline-offset-4"
          >
            Events
          </Link>
          <Link
            href="/calendar"
            className="font-medium hover:underline underline-offset-4"
          >
            Calendar
          </Link>
          <Link
            href="/gallery"
            className="font-medium hover:underline underline-offset-4"
          >
            Gallery
          </Link>
          <Link
            href="/hof"
            className="font-medium hover:underline underline-offset-4"
          >
            Hall of Fame
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="#join" className="hidden sm:block">
            <Button className="bg-pink-500 cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Join Now
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-black"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white border-t border-gray-200">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/library"
              className="font-medium py-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
            <Link
              href="/events"
              className="font-medium py-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/calendar"
              className="font-medium py-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link
              href="/gallery"
              className="font-medium py-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/hof"
              className="font-medium py-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Hall of Fame
            </Link>
            <Link
              href="#join"
              className="sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full bg-pink-500 cursor-pointer hover:bg-pink-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Join Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
