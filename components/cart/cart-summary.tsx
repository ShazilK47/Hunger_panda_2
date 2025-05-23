"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { formatCurrency } from "@/lib/utils/format";

export function CartSummary() {
  const { cart, clearCart } = useCart();
  const { totalItems, totalAmount } = cart;

  // Delivery fee and calculation
  const deliveryFee = 2.99;
  const subtotal = totalAmount;
  const orderTotal = subtotal + deliveryFee;

  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Delivery Fee</p>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(deliveryFee)}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">Order total</p>
            <p className="text-base font-medium text-gray-900">
              {formatCurrency(orderTotal)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {totalItems > 0 ? (
          <>
            <Link href="/checkout" className="w-full">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>

            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>
          </>
        ) : (
          <Link href="/restaurants" className="w-full">
            <Button className="w-full">Browse Restaurants</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
