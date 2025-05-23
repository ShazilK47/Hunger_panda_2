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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Restaurant</Button>
      </div>

      {/* Restaurant Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Restaurant</h2>
            <RestaurantForm
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Restaurant List */}
      <RestaurantList isAdmin={true} ref={listRef} />
    </div>
  );
}
