"use client";

import type React from "react";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LibraryFiltersProps {
  genres: string[];
  onFilterChange: (filters: {
    status: string;
    genre: string;
    search: string;
  }) => void;
}

export function LibraryFilters({
  genres,
  onFilterChange,
}: LibraryFiltersProps) {
  const [status, setStatus] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [search, setSearch] = useState("");

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onFilterChange({ status: newStatus, genre: selectedGenre, search });
  };

  const handleGenreChange = (newGenre: string) => {
    setSelectedGenre(newGenre);
    onFilterChange({ status, genre: newGenre, search });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ status, genre: selectedGenre, search: e.target.value });
  };

  const clearFilters = () => {
    setStatus("all");
    setSelectedGenre("all");
    setSearch("");
    onFilterChange({ status: "all", genre: "all", search: "" });
  };

  const hasActiveFilters =
    status !== "all" || selectedGenre !== "all" || search !== "";

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Filter Manga</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-xs border border-gray-300 hover:bg-gray-100"
          >
            <X className="h-3 w-3 mr-1" /> Clear Filters
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search by title or author..."
            value={search}
            onChange={handleSearchChange}
            className="pl-8 border-2 border-black"
          />
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {["all", "available", "borrowed"].map((statusOption) => (
            <Button
              key={statusOption}
              onClick={() => handleStatusChange(statusOption)}
              className={cn(
                "border-2 border-black",
                status === statusOption
                  ? statusOption === "available"
                    ? "bg-green-300 hover:bg-green-400 text-black"
                    : statusOption === "borrowed"
                    ? "bg-red-300 hover:bg-red-400 text-black"
                    : "bg-yellow-300 hover:bg-yellow-400 text-black"
                  : "bg-white hover:bg-gray-100 text-black"
              )}
            >
              {statusOption === "all"
                ? "All"
                : statusOption === "available"
                ? "Available"
                : "Borrowed"}
            </Button>
          ))}
        </div>
      </div>

      {/* Genre filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">Genre</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleGenreChange("all")}
            className={cn(
              "border-2 border-black",
              selectedGenre === "all"
                ? "bg-yellow-300 hover:bg-yellow-400 text-black"
                : "bg-white hover:bg-gray-100 text-black"
            )}
          >
            All Genres
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={cn(
                "border-2 border-black",
                selectedGenre === genre
                  ? "bg-cyan-300 hover:bg-cyan-400 text-black"
                  : "bg-white hover:bg-gray-100 text-black"
              )}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
