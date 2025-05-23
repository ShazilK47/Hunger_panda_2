"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { CartSummary } from "@/components/cart/cart-summary";
import { OrderForm } from "@/components/order/order-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();
  const isCartEmpty = cart.totalItems === 0;
  useEffect(() => {
    // Check cart status and redirect if empty
    if (isCartEmpty) {
      console.log("Cart is empty, redirecting to cart page");
      // Use router.push instead of window.location for client-side navigation
      router.push("/cart");
    }
  }, [isCartEmpty, router]);

  if (isCartEmpty) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link href="/cart">
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
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <OrderForm />
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <CartSummary />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  By placing your order, you agree to Hungry Panda&apos;s terms
                  of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
