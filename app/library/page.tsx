import { createClient } from "@/utils/supabase/server";
import LibraryPageClient from "@/components/library/library-client";
import { MangaType } from "@/lib/definitions";

//genres don't work ask michael
export default async function LibraryPage() {
  const supabase = await createClient();

  const { data: mangaDataResult, error: mangaError } = await supabase
    .from("manga")
    .select("*, genre (id, genre)");

  const { data: genresData, error: genresError } = await supabase
    .from("genre")
    .select("genre");

  const mangaData: MangaType[] = mangaDataResult || [];
  const genres: string[] = genresData ? genresData.map((g) => g.genre) : [];

  return (
    <LibraryPageClient initialMangaData={mangaData} initialGenres={genres} />
  );
}
