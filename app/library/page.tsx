import { createClient } from "@/utils/supabase/server";
import LibraryPageClient from "@/components/library-client";

interface Manga {
  id: string;
  title: string;
  author: string;
  volume: number;
  coverImage: string;
  genre: string[];
  borrowedby: string | null | undefined;
}

export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: mangaDataResult, error: mangaError } = await supabase
    .from("manga")
    .select("*, genre (id, genre)");

  const { data: genresData, error: genresError } = await supabase
    .from("genre")
    .select("genre");

  const mangaData: Manga[] = mangaDataResult || [];
  const genres: string[] = genresData ? genresData.map((g) => g.genre) : [];

  return (
    <LibraryPageClient initialMangaData={mangaData} initialGenres={genres} />
  );
}
