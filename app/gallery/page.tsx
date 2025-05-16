"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { SectionContainer } from "@/components/section-container";
import { SectionHeading } from "@/components/section-heading";
import { GalleryImage } from "@/components/gallery/gallery-image";
import { GalleryFilter } from "@/components/gallery/gallery-filter";
import { Button } from "@/components/ui/button";
// Gallery data structure
interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  year: string;
}

export default function GalleryPage() {
  // Categories and years for filtering
  const categories = ["All", "Events", "Regular Sessions", "Collaborations"];
  const years = ["All", "2026", "2025", "2024", "2023", "2022", "2021", "2020"];

  // State for active filters
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeYear, setActiveYear] = useState("All");

  // const pathToImage = "game_one/gameOneGameTile.jpeg";
  // const { data: image_url } = supabase.storage
  //   .from("gallery")
  //   .getPublicUrl(pathToImage);

  //do the rest of this shit tomorrow
  // Sample gallery data
  const galleryItems: GalleryItem[] = [
    // 2023 Events
    {
      id: "e1-2023",
      src: "/placeholder.svg?height=400&width=600&text=Cosplay+Contest+2023",
      alt: "Spring Cosplay Contest 2023",
      category: "Events",
      year: "2023",
    },
    {
      id: "e2-2023",
      src: "/placeholder.svg?height=400&width=600&text=Anime+Convention+2023",
      alt: "Annual Anime Convention Trip 2023",
      category: "Events",
      year: "2023",
    },
    {
      id: "e3-2023",
      src: "/placeholder.svg?height=400&width=600&text=Christmas+Party+2023",
      alt: "Christmas Party 2023",
      category: "Events",
      year: "2023",
    },

    // 2023 Regular Sessions
    {
      id: "r1-2023",
      src: "/placeholder.svg?height=400&width=600&text=Weekly+Session+Jan+2023",
      alt: "Weekly Anime Screening - January 2023",
      category: "Regular Sessions",
      year: "2023",
    },
    {
      id: "r2-2023",
      src: "/placeholder.svg?height=400&width=600&text=Weekly+Session+Mar+2023",
      alt: "Weekly Anime Screening - March 2023",
      category: "Regular Sessions",
      year: "2023",
    },

    // 2023 Collaborations
    {
      id: "c1-2023",
      src: "/placeholder.svg?height=400&width=600&text=Japanese+Society+Collab+2023",
      alt: "Collaboration with Japanese Society 2023",
      category: "Collaborations",
      year: "2023",
    },

    // 2022 Events
    {
      id: "e1-2022",
      src: "/placeholder.svg?height=400&width=600&text=Cosplay+Contest+2022",
      alt: "Spring Cosplay Contest 2022",
      category: "Events",
      year: "2022",
    },
    {
      id: "e2-2022",
      src: "/placeholder.svg?height=400&width=600&text=Anime+Convention+2022",
      alt: "Annual Anime Convention Trip 2022",
      category: "Events",
      year: "2022",
    },

    // 2022 Regular Sessions
    {
      id: "r1-2022",
      src: "/placeholder.svg?height=400&width=600&text=Weekly+Session+Feb+2022",
      alt: "Weekly Anime Screening - February 2022",
      category: "Regular Sessions",
      year: "2022",
    },

    // 2022 Collaborations
    {
      id: "c1-2022",
      src: "/placeholder.svg?height=400&width=600&text=Art+Society+Collab+2022",
      alt: "Collaboration with Art Society 2022",
      category: "Collaborations",
      year: "2022",
    },
    {
      id: "c2-2022",
      src: "/placeholder.svg?height=400&width=600&text=Film+Society+Collab+2022",
      alt: "Collaboration with Film Society 2022",
      category: "Collaborations",
      year: "2022",
    },

    // 2021 Events
    {
      id: "e1-2021",
      src: "/placeholder.svg?height=400&width=600&text=Virtual+Cosplay+2021",
      alt: "Virtual Cosplay Contest 2021",
      category: "Events",
      year: "2021",
    },

    // 2021 Regular Sessions
    {
      id: "r1-2021",
      src: "/placeholder.svg?height=400&width=600&text=Online+Session+2021",
      alt: "Online Anime Screening 2021",
      category: "Regular Sessions",
      year: "2021",
    },

    // 2020 Events
    {
      id: "e1-2020",
      src: "/placeholder.svg?height=400&width=600&text=Welcome+Event+2020",
      alt: "Welcome Event 2020",
      category: "Events",
      year: "2020",
    },
    {
      id: "e2-2020",
      src: "/placeholder.svg?height=400&width=600&text=Anime+Quiz+2020",
      alt: "Anime Quiz Night 2020",
      category: "Events",
      year: "2020",
    },
  ];

  // Filter gallery items based on active filters
  const filteredItems = galleryItems.filter((item) => {
    const categoryMatch =
      activeCategory === "All" || item.category === activeCategory;
    const yearMatch = activeYear === "All" || item.year === activeYear;
    return categoryMatch && yearMatch;
  });

  return (
    <div className="flex min-h-screen flex-col w-full">
      <main className="flex-1">
        <SectionContainer>
          <div className="mb-4">
            <Button asChild variant="outline" className="border-2 border-black">
              <Link href="/" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <SectionHeading
            badge="MEMORIES"
            title="Photo Gallery"
            description="Browse through our collection of photos from events, weekly sessions, and collaborations over the years."
            badgeColor="bg-pink-300"
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar with filters */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-bold mb-6">Filter Gallery</h2>
                <GalleryFilter
                  categories={categories}
                  years={years}
                  onCategoryChange={setActiveCategory}
                  onYearChange={setActiveYear}
                  activeCategory={activeCategory}
                  activeYear={activeYear}
                />

                <div className="mt-8 pt-6 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Currently showing:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-pink-100 px-2 py-1 text-sm border border-pink-300 rounded-md">
                      {activeCategory}
                    </span>
                    <span className="bg-cyan-100 px-2 py-1 text-sm border border-cyan-300 rounded-md">
                      {activeYear}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    {filteredItems.length} photo
                    {filteredItems.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery grid */}
            <div>
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <GalleryImage
                      key={item.id}
                      src={item.src}
                      alt={item.alt}
                      width={600}
                      height={400}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-4 border-black bg-yellow-100 p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xl font-bold mb-2">No photos found</h3>
                  <p>Try changing your filters to see more photos.</p>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
