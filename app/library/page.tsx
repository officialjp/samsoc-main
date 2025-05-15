"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { MangaCard } from "@/components/manga-card";
import { LibraryFilters } from "@/components/library-filters";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const supabase = await createClient();

interface Manga {
  id: string;
  title: string;
  author: string;
  volume: number;
  coverImage: string;
  genre: string[];
  borrowedby: string | null | undefined;
}

const ITEMS_PER_PAGE = 12;

export default function LibraryPage() {
  const [filters, setFilters] = useState({
    status: "all",
    genre: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mangaData, setMangaData] = useState<Manga[]>([]);
  const [filteredManga, setFilteredManga] = useState<Manga[]>([]);
  const [paginatedManga, setPaginatedManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allGenres, setAllGenres] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: mangaDataResult, error: mangaError } = await supabase
        .from("manga")
        .select("*, genre (id, genre)");

      if (mangaError) {
        setError("Failed to load manga data.");
        setLoading(false);
        return;
      }
      setMangaData(mangaDataResult || []);

      const { data: genresData, error: genresError } = await supabase
        .from("genre")
        .select("genre");

      if (genresError) {
        setError("Failed to load genres.");
        setLoading(false);
        return;
      }

      const genres = genresData ? genresData.map((genre) => genre.genre) : [];
      setAllGenres(genres);
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (mangaData.length > 0 && allGenres.length > 0) {
      const filtered = mangaData.filter((manga) => {
        const isBorrowed = !!manga.borrowedby && manga.borrowedby !== "NULL";
        if (filters.status === "available" && isBorrowed) return false;
        if (filters.status === "borrowed" && !isBorrowed) return false;
        if (filters.genre !== "all" && !manga.genre.includes(filters.genre))
          return false;
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
      setCurrentPage(1);
    }
  }, [filters, mangaData, allGenres]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedManga(filteredManga.slice(startIndex, endIndex));
  }, [filteredManga, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const resultsElement = document.getElementById("manga-results");
    resultsElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalManga = mangaData.length;
  const availableManga = mangaData.filter(
    (manga) => !manga.borrowedby || manga.borrowedby === "NULL"
  ).length;
  const borrowedManga = totalManga - availableManga;

  if (loading) {
    return <div>Loading manga library...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                        isAvailable={
                          !manga.borrowedby || manga.borrowedby === "NULL"
                        }
                        borrowedBy={
                          typeof manga.borrowedby === "string"
                            ? manga.borrowedby
                            : undefined
                        } // Conditional prop passing
                      />
                    ))}
                  </div>

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
    </div>
  );
}
