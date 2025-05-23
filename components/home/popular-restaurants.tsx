"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { Restaurant } from "@/lib/types/restaurant";
import { getPopularRestaurants } from "@/lib/actions/restaurant";

export default function PopularRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getPopularRestaurants(3); // Fetch 3 popular restaurants
        setRestaurants(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif">
          Popular <span className="text-primary">Restaurants</span>
        </h2>

        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl h-64 shadow-card animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : restaurants.length > 0 ? (
          // Success state with restaurants
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center p-8">
            <p className="text-gray-500">
              No restaurants available at the moment.
            </p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/restaurants"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-pill text-sm font-medium transition-all border-2 border-primary text-primary bg-transparent hover:bg-primary/5 h-11 px-6 py-2"
          >
            View All Restaurants
          </Link>
        </div>
      </div>
    </section>
  );
}
