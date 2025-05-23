"use client";

import { useState } from "react";
import { MenuItem } from "@/lib/types/menu";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/format";

interface MenuItemCardProps {
  menuItem: MenuItem;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  inCart?: boolean;
}

export function MenuItemCard({
  menuItem,
  onAddToCart,
  inCart = false,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { name, description, price, imageUrl, category } = menuItem;

  // Default image if none provided
  const displayImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80";

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(menuItem, quantity);
      // Reset quantity after adding to cart
      setQuantity(1);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform hover:shadow-md">
      <CardImage src={displayImage} alt={name} />
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{name}</CardTitle>
            <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full mt-2">
              {category}
            </span>
          </div>
          <div className="text-lg font-bold text-orange-600">
            {formatCurrency(price)}
          </div>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>

      {onAddToCart && (
        <CardFooter className="pt-4 border-t">
          <div className="w-full flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <button
                className="px-3 py-1 text-gray-600 disabled:opacity-50"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-1 font-medium">{quantity}</span>
              <button
                className="px-3 py-1 text-gray-600"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              disabled={inCart}
            >
              {inCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
