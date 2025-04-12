"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

import { Footer } from "@/components/footer";
import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { MangaCard } from "@/components/manga-card";
import { LibraryFilters } from "@/components/library-filters";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";

// Generate a larger sample manga data set
const generateMangaData = () => {
  const titles = [
    "Demon Slayer",
    "My Hero Academia",
    "Spy x Family",
    "Attack on Titan",
    "Jujutsu Kaisen",
    "One Piece",
    "Naruto",
    "Fullmetal Alchemist",
    "Tokyo Ghoul",
    "Death Note",
    "Dragon Ball",
    "Bleach",
    "Hunter x Hunter",
    "One Punch Man",
    "Chainsaw Man",
    "Haikyuu!!",
    "Black Clover",
    "Dr. Stone",
    "The Promised Neverland",
    "Vinland Saga",
    "Made in Abyss",
    "Berserk",
    "Vagabond",
    "Monster",
    "Slam Dunk",
    "Goodnight Punpun",
    "Yotsuba&!",
  ];

  const authors = [
    "Koyoharu Gotouge",
    "Kohei Horikoshi",
    "Tatsuya Endo",
    "Hajime Isayama",
    "Gege Akutami",
    "Eiichiro Oda",
    "Masashi Kishimoto",
    "Hiromu Arakawa",
    "Sui Ishida",
    "Tsugumi Ohba",
    "Akira Toriyama",
    "Tite Kubo",
    "Yoshihiro Togashi",
    "ONE",
    "Tatsuki Fujimoto",
    "Haruichi Furudate",
    "Yūki Tabata",
    "Riichiro Inagaki",
    "Kaiu Shirai",
    "Makoto Yukimura",
    "Akihito Tsukushi",
    "Kentaro Miura",
    "Takehiko Inoue",
    "Naoki Urasawa",
    "Takehiko Inoue",
    "Inio Asano",
    "Kiyohiko Azuma",
  ];

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
    "Psychological",
    "Historical",
    "School",
    "Seinen",
    "Shounen",
    "Shoujo",
  ];

  const mangaData = [];
  let id = 1;

  // Create multiple volumes for each title
  titles.forEach((title, titleIndex) => {
    const author = authors[titleIndex % authors.length];
    const titleGenres = [
      genres[Math.floor(Math.random() * genres.length)],
      genres[Math.floor(Math.random() * genres.length)],
      genres[Math.floor(Math.random() * genres.length)],
    ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

    // Create 3-10 volumes for each title
    const volumeCount = Math.floor(Math.random() * 8) + 3;

    for (let volume = 1; volume <= volumeCount; volume++) {
      const isAvailable = Math.random() > 0.3; // 70% chance of being available

      const manga = {
        id: id.toString(),
        title,
        author,
        volume,
        coverImage: `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(
          title
        )}+Vol.${volume}`,
        genre: titleGenres,
        isAvailable,
      };

      if (!isAvailable) {
        const borrowers = [
          "Alex Chen",
          "Emma Wilson",
          "David Park",
          "Sophia Patel",
          "Marcus Lee",
          "Lily Chen",
        ];
        const borrower =
          borrowers[Math.floor(Math.random() * borrowers.length)];

        // Generate a random due date in the next 30 days
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);

        manga.dueDate = dueDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        manga.borrowedBy = borrower;
      }

      mangaData.push(manga);
      id++;
    }
  });

  return mangaData;
};

const mangaData = generateMangaData();

// Extract unique genres from manga data
const allGenres = Array.from(
  new Set(mangaData.flatMap((manga) => manga.genre))
).sort();

// Items per page
const ITEMS_PER_PAGE = 12;

export default function LibraryPage() {
  const [filters, setFilters] = useState({
    status: "all",
    genre: "all",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredManga, setFilteredManga] = useState(mangaData);
  const [paginatedManga, setPaginatedManga] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Apply filters to manga data
  useEffect(() => {
    const filtered = mangaData.filter((manga) => {
      // Filter by status
      if (filters.status === "available" && !manga.isAvailable) return false;
      if (filters.status === "borrowed" && manga.isAvailable) return false;

      // Filter by genre
      if (filters.genre !== "all" && !manga.genre.includes(filters.genre))
        return false;

      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          manga.title.toLowerCase().includes(searchTerm) ||
          manga.author.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });

    setFilteredManga(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedManga(filteredManga.slice(startIndex, endIndex));
  }, [filteredManga, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById("manga-results")?.offsetTop - 100 || 0,
      behavior: "smooth",
    });
  };

  // Stats for the library
  const totalManga = mangaData.length;
  const availableManga = mangaData.filter((manga) => manga.isAvailable).length;
  const borrowedManga = totalManga - availableManga;

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer background="bg-purple-50">
          <div className="mb-4">
            <Button asChild variant="outline" className="border-2 border-black">
              <Link href="/" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <SectionHeading
            badge="MANGA"
            title="Our Library"
            description="Browse our collection of manga available to borrow. Paid members can check out up to 3 volumes at a time for up to 2 weeks."
            badgeColor="bg-cyan-300"
            className="mb-8"
          />

          {/* Library stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <h3 className="text-lg font-bold">Total Manga</h3>
              <p className="text-3xl font-bold">{totalManga}</p>
              <p className="text-sm text-gray-500">volumes in collection</p>
            </div>
            <div className="bg-green-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <h3 className="text-lg font-bold">Available</h3>
              <p className="text-3xl font-bold text-green-600">
                {availableManga}
              </p>
              <p className="text-sm text-gray-500">volumes ready to borrow</p>
            </div>
            <div className="bg-red-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
              <h3 className="text-lg font-bold">Borrowed</h3>
              <p className="text-3xl font-bold text-red-600">{borrowedManga}</p>
              <p className="text-sm text-gray-500">
                volumes currently checked out
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar with filters */}
            <div className="lg:sticky lg:top-24 h-fit">
              <LibraryFilters
                genres={allGenres}
                onFilterChange={(newFilters) => setFilters(newFilters)}
              />

              <div className="mt-6 bg-yellow-100 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Library Rules
                </h3>
                <ul className="text-sm space-y-2">
                  <li>• Paid members only</li>
                  <li>• Maximum 3 volumes at a time</li>
                  <li>• 2-week borrowing period</li>
                  <li>• £1 late fee per week</li>
                  <li>• Replacement cost for damaged items</li>
                </ul>
              </div>
            </div>

            {/* Manga grid */}
            <div id="manga-results">
              {filteredManga.length > 0 ? (
                <>
                  <div className="mb-4 text-sm text-gray-500">
                    Showing {paginatedManga.length} of {filteredManga.length}{" "}
                    results
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedManga.map((manga) => (
                      <MangaCard
                        key={manga.id}
                        id={manga.id}
                        title={manga.title}
                        author={manga.author}
                        volume={manga.volume}
                        coverImage={manga.coverImage}
                        genre={manga.genre}
                        isAvailable={manga.isAvailable}
                        dueDate={manga.dueDate}
                        borrowedBy={manga.borrowedBy}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <div className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xl font-bold mb-2">No manga found</h3>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </main>
      <Footer />
    </div>
  );
}
