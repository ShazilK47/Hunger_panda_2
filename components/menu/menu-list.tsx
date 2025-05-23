"use client";

import { MenuItem } from "@/lib/types/menu";
import { MenuItemCard } from "./menu-item-card";
import { useState } from "react";

interface MenuListProps {
  menuItems: MenuItem[];
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  cartItems?: MenuItem[];
}

export function MenuList({
  menuItems,
  onAddToCart,
  cartItems = [],
}: MenuListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  // Filter menu items based on search query and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Check if an item is in the cart
  const isInCart = (menuItemId: string) => {
    return cartItems.some((item) => item.id === menuItemId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search menu items..."
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

        <div className="flex-shrink-0">
          <select
            className="w-full md:w-auto px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No menu items found</p>
          <p className="text-gray-500 mt-2">
            Try a different search term or category!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem.id}
              menuItem={menuItem}
              onAddToCart={onAddToCart}
              inCart={isInCart(menuItem.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
