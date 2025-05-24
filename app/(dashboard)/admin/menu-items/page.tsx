"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MenuItemForm from "@/components/menu/menu-item-form";
import AdminMenuList from "@/components/menu/admin-menu-list";
import { MenuItem } from "@/lib/types/menu";

export default function AdminMenuItems() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Menu Items</h1>
        <Button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto"
        >
          Add Menu Item
        </Button>
      </div>

      {/* Menu Item Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                {selectedItem ? "Edit" : "Add"} Menu Item
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <MenuItemForm
              item={selectedItem}
              onSuccess={() => {
                setIsFormOpen(false);
                setSelectedItem(null);
              }}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedItem(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <AdminMenuList onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
