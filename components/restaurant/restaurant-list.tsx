"use client";

import { Restaurant } from "@/lib/types/restaurant";
import { RestaurantCard } from "./restaurant-card";
import { useState } from "react";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export function RestaurantList({ restaurants }: RestaurantListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.description &&
        restaurant.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No restaurants found</p>
          <p className="text-gray-500 mt-2">
            Try a different search term or check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
