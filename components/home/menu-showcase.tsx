"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MenuItem } from "@/lib/types/menu";
import { getPopularMenuItems } from "@/lib/actions/popular-items";
import { formatCurrency } from "@/lib/utils/format";
import MenuItemModal from "../menu/menu-item-modal";
import { useCart } from "@/components/cart/cart-context";

// Category filter pill component
function CategoryFilter({
  category,
  isActive,
  onClick,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? "bg-primary text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {category}
    </button>
  );
}

interface MenuShowcaseItemProps {
  item: MenuItem;
  index: number;
  onQuickView: (item: MenuItem) => void;
}

function MenuShowcaseItem({ item, index, onQuickView }: MenuShowcaseItemProps) {
  const { addToCart, isInCart } = useCart();
  const { name, price, description, category, imageUrl } = item;

  const inCart = isInCart(item.id);

  // Default image if none provided
  const displayImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3";

  // Calculate animation delay based on index
  const animationDelay = `${index * 100}ms`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-card hover:shadow-hover transition-all hover-lift fade-in"
      style={{ animationDelay }}
    >
      <div className="p-4 text-center group h-full flex flex-col">
        <div
          className="relative w-32 h-32 mx-auto mb-4 cursor-pointer"
          onClick={() => onQuickView(item)}
        >
          <div className="absolute inset-0 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-all"></div>
          <div className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={displayImage}
                alt={name}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-500"
                sizes="(max-width: 768px) 25vw, 10vw"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white/90 text-primary text-xs px-2 py-1 rounded-full">
              Quick View
            </span>
          </div>
        </div>
        <span className="inline-block px-3 py-1 bg-secondary text-primary text-xs rounded-full mb-2">
          {category}
        </span>
        <h3 className="text-xl font-semibold font-serif">{name}</h3>
        {description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-primary font-medium my-2 mt-auto">
          {formatCurrency(price)}
        </p>{" "}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-4 right-4 w-10 h-10 ${
            inCart ? "bg-gray-400" : "bg-primary hover:bg-primary/90"
          } text-black rounded-full flex items-center justify-center shadow-sm transition-all ${
            !inCart ? "pulse-subtle" : ""
          }`}
          disabled={inCart}
          title={inCart ? "Item already in cart" : "Add to cart"}
        >
          <span className="text-lg font-bold">{inCart ? "✓" : "+"}</span>
        </button>
      </div>
    </div>
  );
}

export default function MenuShowcase() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Effect to handle intersection observer for animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const sectionEl = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionEl);

    return () => {
      observer.unobserve(sectionEl);
    };
  }, []);
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const data = await getPopularMenuItems({
          limit: 8,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setMenuItems(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["All", ...uniqueCategories]);

        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to load popular dishes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [retryCount]); // Retry handler
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  // Category selection handler with dynamic data fetching
  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);

    // Only fetch from API if we have real data (not fallback)
    if (menuItems.length > 0) {
      try {
        setLoading(true);
        const data = await getPopularMenuItems({
          limit: 8,
          category: category !== "All" ? category : undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setMenuItems(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items by category:", err);
        setError(
          "Failed to load dishes in this category. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickView = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Fallback items in case the database is empty
  const fallbackItems = [
    {
      id: "1",
      name: "Papparadelle",
      description: "Fresh pasta with creamy sauce and seasonal vegetables",
      price: 12.0,
      imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      category: "Pasta",
      restaurantId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: "Ricotta Stuffed Ravioli",
      description: "Classic Italian dish with handmade pasta",
      price: 14.0,
      imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      category: "Pasta",
      restaurantId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Garlic Butter Steak",
      description: "Prime steak with garlic butter and roasted vegetables",
      price: 18.0,
      imageUrl: "https://images.unsplash.com/photo-1617093727343-374698b1b08d",
      category: "Steak",
      restaurantId: "3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      name: "Asian Noodle Bowl",
      description: "Flavorful noodles with fresh vegetables and spicy sauce",
      price: 15.0,
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
      category: "Asian",
      restaurantId: "2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "5",
      name: "Mediterranean Salad",
      description: "Fresh greens with feta, olives and lemon vinaigrette",
      price: 10.0,
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      category: "Salad",
      restaurantId: "2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "6",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella and fresh basil",
      price: 13.0,
      imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
      category: "Pizza",
      restaurantId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "7",
      name: "Vegetable Curry",
      description: "Aromatic curry with seasonal vegetables and basmati rice",
      price: 14.0,
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641",
      category: "Curry",
      restaurantId: "3",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "8",
      name: "Chocolate Lava Cake",
      description:
        "Warm chocolate cake with a melting center and vanilla ice cream",
      price: 8.0,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
      category: "Dessert",
      restaurantId: "2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Use the fetched items or fallback to our static items if there's no data
  const allItemsToDisplay = menuItems.length > 0 ? menuItems : fallbackItems;

  // Filter items by selected category
  const filteredItems =
    selectedCategory === "All"
      ? allItemsToDisplay
      : allItemsToDisplay.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 font-serif slide-in-left">
            Our Popular <span className="text-primary">Dishes</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto slide-in-right">
            Explore our most loved dishes, prepared with fresh ingredients and
            culinary expertise. Each dish is crafted to bring you the perfect
            blend of flavors.
          </p>
        </div>

        {/* Category Filters */}
        {!loading && !error && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 fade-in">
            {categories.map((category) => (
              <CategoryFilter
                key={category}
                category={category}
                isActive={selectedCategory === category}
                onClick={() => handleCategorySelect(category)}
              />
            ))}
          </div>
        )}

        {loading ? (
          // Loading state with improved skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-card p-4 h-64 animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mt-2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state with retry
          <div className="text-center p-8 bg-red-50 rounded-lg max-w-md mx-auto">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          // Success state with animation
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <MenuShowcaseItem
                  key={item.id}
                  item={item}
                  index={index}
                  onQuickView={handleQuickView}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  No dishes found in this category.
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
              View Full Menu
            </button>
          </div>
        )}

        {/* Menu Item Modal */}
        {selectedItem && (
          <MenuItemModal
            isOpen={isModalOpen}
            closeModal={handleCloseModal}
            item={selectedItem}
          />
        )}
      </div>
    </section>
  );
}
