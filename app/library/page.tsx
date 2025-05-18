import { createClient } from "@/utils/supabase/server";
import LibraryPageClient from "@/components/library/library-client";
import { MangaType } from "@/lib/definitions";

async function getMangaWithGenres() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("manga").select(`
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

  if (error) {
    console.error("Error fetching manga with genres:", error);
    return null;
  }

  const actualMangaData = data.map((manga) => ({
    id: manga.id,
    title: manga.title,
    author: manga.author,
    volume: manga.volume,
    borrowedby: manga.borrowedby,
    coverimage: manga.coverimage,
    genre: manga.genre.map((genre) => genre.genre),
  }));

  return actualMangaData;
}

async function getGenres() {
  const supabase = await createClient();
  const { data: allGenres, error } = await supabase
    .from("genre")
    .select("genre");

  if (error) {
    console.error("Error fetching all genres");
    return null;
  }

  return allGenres;
}

export default async function LibraryPage() {
  const mangaDataResult = await getMangaWithGenres();
  const mangaData: MangaType[] = mangaDataResult || [];
  const genreData: { genre: string }[] | null = await getGenres(); // Assuming you know genre is always string

  let allGenres: string[] = [];

  if (genreData) {
    allGenres = genreData.map((item) => item.genre);
  } else {
    console.warn("Genre data could not be loaded.");
    allGenres = [];
  }

  return (
    <LibraryPageClient initialMangaData={mangaData} initialGenres={allGenres} />
  );
}
