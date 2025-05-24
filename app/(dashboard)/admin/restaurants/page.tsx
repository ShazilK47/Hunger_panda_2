"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import RestaurantForm from "@/components/restaurant/restaurant-form";
import { RestaurantList } from "@/components/restaurant/restaurant-list";

export default function AdminRestaurants() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const listRef = useRef<{ fetchRestaurants: () => Promise<void> }>(null);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    // Refresh the restaurant list
    listRef.current?.fetchRestaurants?.();
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Restaurants</h1>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto"
        >
          Add Restaurant
        </Button>
      </div>

      {/* Restaurant Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">Add Restaurant</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <RestaurantForm
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Restaurant List */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <RestaurantList isAdmin={true} ref={listRef} />
        </div>
      </div>
    </div>
  );
}
