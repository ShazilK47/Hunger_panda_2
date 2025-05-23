"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getRestaurantById } from "@/lib/actions/restaurant";
import { getMenuItemsByRestaurant } from "@/lib/actions/menu-item";
import { MenuList } from "@/components/menu/menu-list";
import { useCart } from "@/components/cart/cart-context";
import { MenuItem } from "@/lib/types/menu";
import { Restaurant } from "@/lib/types/restaurant";
import { useEffect, useState, use } from "react";

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { cart, addToCart } = useCart();
  const unwrappedParams = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const restaurantData = await getRestaurantById(unwrappedParams.id);

        if (!restaurantData) {
          return notFound();
        }

        setRestaurant(restaurantData);

        const menuItemsData = await getMenuItemsByRestaurant(
          unwrappedParams.id
        );
        setMenuItems(menuItemsData);
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError("Failed to load restaurant data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-40 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="lg:w-1/2 h-[300px] bg-gray-200 rounded-lg"></div>
              <div className="lg:w-1/2">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-6"></div>
                <div className="flex items-start gap-2 mb-6">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4">
              <Link href="/restaurants">
                <Button variant="outline">Browse Other Restaurants</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!restaurant) {
    return notFound();
  }

  // Default image if none provided
  const displayImage =
    restaurant.imageUrl ||
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80";

  const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
    addToCart(menuItem, quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/restaurants">
            <Button variant="outline" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back to Restaurants
            </Button>
          </Link>

          {cart.totalItems > 0 && (
            <Link href="/cart">
              <Button className="gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                View Cart ({cart.totalItems})
              </Button>
            </Link>
          )}
        </div>{" "}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="lg:w-1/2">
            <Image
              src={displayImage}
              alt={restaurant.name}
              width={800}
              height={400}
              className="w-full h-[300px] object-cover rounded-lg"
              priority
            />
          </div>
          <div className="lg:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {restaurant.name}
            </h1>
            {restaurant.description && (
              <p className="text-lg text-gray-600 mb-4">
                {restaurant.description}
              </p>
            )}
            <div className="flex items-start gap-2 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Menu Items</h2>

          {menuItems.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">No menu items available</p>
              <p className="text-gray-500 mt-2">
                Check back later for updates!
              </p>
            </div>
          ) : (
            <MenuList
              menuItems={menuItems}
              onAddToCart={handleAddToCart}
              cartItems={cart.items.map((item) => item.menuItem)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
