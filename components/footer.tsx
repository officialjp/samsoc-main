import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white">
      <div className="container w-full max-w-full px-4 md:px-6 lg:px-8 flex flex-col gap-4 py-10 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="#" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-yellow-400 px-2 py-1 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Surrey Anime and Manga
            </span>
            <span>Society</span>
          </Link>
          <p className="text-sm text-gray-500">
            Bringing anime fans together since 2008
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:underline">
                Home
              </Link>
              <Link href="#about" className="text-sm hover:underline">
                About
              </Link>
              <Link href="#events" className="text-sm hover:underline">
                Events
              </Link>
              <Link href="#gallery" className="text-sm hover:underline">
                Gallery
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Contact</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="mailto:anime@university.edu"
                className="text-sm hover:underline"
              >
                anime@surrey.ac.uk
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Instagram
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Discord
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Anime University Society. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
