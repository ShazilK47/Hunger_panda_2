"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/types/restaurant";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getRestaurants } from "@/lib/actions/restaurant";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Restaurant[]>([]);
  const router = useRouter();
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await getRestaurants(trimmedTerm);
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (restaurantId: string) => {
    // Clear search
    setSearchTerm("");
    setResults([]);

    // Navigate to restaurant page
    router.push(`/restaurants/${restaurantId}`);
  };

  return (
    <div className="relative max-w-md mx-auto w-full">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for restaurants or cuisines..."
          className="w-full py-3 pl-4 pr-12 rounded-pill border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
          disabled={isSearching}
        >
          {isSearching ? (
            <span className="block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </form>{" "}
      {/* Backdrop */}
      {results.length > 0 && (
        <div
          className="fixed inset-0 bg-black/20 z-60"
          onClick={() => setResults([])}
        />
      )}
      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-100 max-h-96 overflow-auto">
          <div className="p-2">
            {results.map((restaurant) => (
              <div
                key={restaurant.id}
                className="p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors flex items-center"
                onClick={() => handleResultClick(restaurant.id)}
              >
                <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                  {restaurant.imageUrl ? (
                    <Image
                      src={restaurant.imageUrl}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      🍽️
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-500 truncate max-w-[250px]">
                    {restaurant.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
