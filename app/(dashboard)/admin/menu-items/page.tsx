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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <Button
          onClick={() => {
            setSelectedItem(null);
            setIsFormOpen(true);
          }}
        >
          Add Menu Item
        </Button>
      </div>

      {/* Menu Item Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedItem ? "Edit" : "Add"} Menu Item
            </h2>
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
      <AdminMenuList onEdit={handleEdit} />
    </div>
  );
}
