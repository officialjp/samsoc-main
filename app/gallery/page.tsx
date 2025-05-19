import GalleryPageClient from "@/components/gallery/gallery-client";
import { createClient } from "@/utils/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: galleryData, error: galleryError } = await supabase
    .from("gallery")
    .select("id, src, public_url, alt, category, year");

  if (galleryError) {
    return [];
  }

  return <GalleryPageClient allGalleryData={galleryData ?? []} />;
}
