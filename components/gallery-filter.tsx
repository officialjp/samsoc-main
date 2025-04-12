"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryFilterProps {
  categories: string[];
  years: string[];
  onCategoryChange: (category: string) => void;
  onYearChange: (year: string) => void;
  activeCategory: string;
  activeYear: string;
}

export function GalleryFilter({
  categories,
  years,
  onCategoryChange,
  onYearChange,
  activeCategory,
  activeYear,
}: GalleryFilterProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "border-2 border-black",
                activeCategory === category
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">Years</h3>
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Button
              key={year}
              onClick={() => onYearChange(year)}
              className={cn(
                "border-2 border-black",
                activeYear === year
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
