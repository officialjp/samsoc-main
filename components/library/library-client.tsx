"use client";

import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import MangaCard from "@/components/library/manga-card";
import { LibraryFilters } from "@/components/library/library-filters";
import { Pagination } from "@/components/pagination";
import { MangaType } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/client";

const ITEMS_PER_PAGE = 12;

const LibraryContent: React.FC = () => {
  const [filters, setFilters] = useState({
    status: "all",
    genre: "all",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allManga, setAllManga] = useState<MangaType[]>([]);
  const [filteredManga, setFilteredManga] = useState<MangaType[]>([]);
  const [paginatedManga, setPaginatedManga] = useState<MangaType[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>(["all"]); // Initialize with "all"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // Fetch manga data with joined genre table
        const { data: mangaData, error: mangaError } = await supabase.from(
          "manga"
        ).select(`
            id,
            title,
            author,
            volume,
            borrowedby,
            coverimage,
            genre (
              genre
            )
          `);

        if (mangaError) {
          setError(`Error fetching manga data: ${mangaError.message}`);
          return;
        }

        const formattedMangaData = mangaData.map((manga) => ({
          id: manga.id,
          title: manga.title,
          author: manga.author,
          volume: manga.volume,
          borrowedby: manga.borrowedby,
          coverimage: manga.coverimage,
          genre: manga.genre.map((g) => g.genre),
        })) as MangaType[];

        setAllManga(formattedMangaData);

        // Fetch all unique genres
        const { data: genresData, error: genresError } = await supabase
          .from("genre")
          .select("genre");

        if (genresError) {
          console.error("Error fetching all genres:", genresError);
          // Don't block the page if genres fail, but log the error
        } else {
          const fetchedGenres = genresData.map((g) => g.genre);
          setAllGenres([...Array.from(new Set(fetchedGenres)).sort()]);
        }
      } catch (err: any) {
        setError(`An unexpected error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  useEffect(() => {
    if (!loading && !error && allManga.length > 0) {
      const filtered = allManga.filter((manga) => {
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
      setPaginatedManga(filtered.slice(0, ITEMS_PER_PAGE));
    }
  }, [filters, allManga, loading, error]);

  useEffect(() => {
    if (!loading && !error && filteredManga.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedManga(filteredManga.slice(startIndex, endIndex));
    }
  }, [filteredManga, currentPage, loading, error]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const resultsElement = document.getElementById("manga-results");
    resultsElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalManga = allManga.length;
  const availableManga = allManga.filter(
    (manga) => !manga.borrowedby || manga.borrowedby === "NULL"
  ).length;
  const borrowedManga = totalManga - availableManga;

  if (loading) {
    return (
      <div className="border-2 border-black bg-gray-100 rounded-md p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-2">Loading manga library...</h3>
        <p>Please wait while we load the shelves.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
      <div className="lg:sticky lg:top-24 h-fit">
        <LibraryFilters
          genres={allGenres}
          onFilterChange={(newFilters) => setFilters(newFilters)}
        />

        <div className="mt-6 bg-white border-2 border-black p-4 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
              Showing {paginatedManga.length} of {filteredManga.length} results
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedManga.map((manga) => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  author={manga.author}
                  volume={manga.volume}
                  coverImage={manga.coverimage}
                  genre={manga.genre}
                  isAvailable={!manga.borrowedby || manga.borrowedby === "NULL"}
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
          <div className="bg-white border-2 border-black p-8 rounded-md text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-2">No manga found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryContent;
