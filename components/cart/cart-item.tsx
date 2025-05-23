"use client";

import { CartItem as CartItemType } from "@/lib/types/cart";
import { useCart } from "./cart-context";
import { formatCurrency } from "@/lib/utils/format";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { id, menuItem, quantity } = item;
  const itemTotal = menuItem.price * quantity;

  return (
    <div className="flex items-start gap-4 py-4 border-b">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={
            menuItem.imageUrl ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80"
          }
          alt={menuItem.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium">{menuItem.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(menuItem.price)}
            </p>
          </div>
          <p className="font-medium text-gray-900">
            {formatCurrency(itemTotal)}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {" "}
          <div className="flex items-center border rounded-md">
            <button
              type="button"
              className="px-3 py-1 text-gray-800 font-bold"
              onClick={() => updateQuantity(id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-3 py-1 font-medium">{quantity}</span>
            <button
              type="button"
              className="px-3 py-1 text-gray-800 font-bold"
              onClick={() => updateQuantity(id, quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="font-medium text-orange-600 hover:text-orange-500"
            onClick={() => removeFromCart(id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
