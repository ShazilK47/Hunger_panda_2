"use client";

import { Restaurant } from "@/lib/types/restaurant";
import { RestaurantCard } from "./restaurant-card";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import RestaurantForm from "./restaurant-form";
import { getRestaurants, deleteRestaurant } from "@/lib/actions/restaurant";
import { isRestaurantError } from "@/lib/types/errors";
import { Button } from "@/components/ui/button";

interface RestaurantListProps {
  isAdmin?: boolean;
}

export const RestaurantList = forwardRef<
  { fetchRestaurants: () => Promise<void> },
  RestaurantListProps
>(function RestaurantList({ isAdmin = false }, ref) {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      if (isRestaurantError(err)) {
        setError(err.message);
      } else {
        setError("Failed to load restaurants. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchRestaurants,
  }));

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteRestaurant(id);
      await fetchRestaurants();
    } catch (err) {
      console.error("Error deleting restaurant:", err);
      if (isRestaurantError(err)) {
        if (err.code === "UNAUTHORIZED") {
          setError("You are not authorized to delete restaurants.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Failed to delete restaurant. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading restaurants...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-10"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
      </div>

      {error ? (
        <div className="text-center py-8 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchRestaurants} variant="outline">
            Try Again
          </Button>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No restaurants found</p>
          <p className="text-gray-500 mt-2">
            Try a different search term or add a new restaurant!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Restaurant</h2>
            <RestaurantForm
              initialData={{
                id: selectedRestaurant.id,
                name: selectedRestaurant.name,
                description: selectedRestaurant.description || "",
                address: selectedRestaurant.address,
                imageUrl: selectedRestaurant.imageUrl || "",
                phone: selectedRestaurant.phone || "",
                cuisine: selectedRestaurant.cuisine || "",
              }}
              onSuccess={() => {
                setIsEditModalOpen(false);
                setSelectedRestaurant(null);
                fetchRestaurants();
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedRestaurant(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
});
