/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/order";

export function OrderForm() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add address state
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Add payment method state
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // This is crucial to prevent default form submission

    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order from cart items
      const order = await createOrder({
        items: cart.items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
        deliveryAddress: `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
        paymentMethod: paymentMethod as any,
      });

      // Clear cart and wait for it to complete
      await clearCart();

      // Redirect to success page with order ID
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Delivery Information</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
      )}

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Street Address
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            required
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      <div className="space-y-2 mb-6">
        <div className="flex items-center">
          <input
            type="radio"
            id="credit"
            name="paymentMethod"
            value="CREDIT_CARD"
            checked={paymentMethod === "CREDIT_CARD"}
            onChange={() => setPaymentMethod("CREDIT_CARD")}
            className="mr-2"
          />
          <label htmlFor="credit">Credit Card</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="paypal"
            name="paymentMethod"
            value="PAYPAL"
            checked={paymentMethod === "PAYPAL"}
            onChange={() => setPaymentMethod("PAYPAL")}
            className="mr-2"
          />
          <label htmlFor="paypal">PayPal</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="cash"
            name="paymentMethod"
            value="CASH"
            checked={paymentMethod === "CASH"}
            onChange={() => setPaymentMethod("CASH")}
            className="mr-2"
          />
          <label htmlFor="cash">Cash on Delivery</label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading || cart.items.length === 0}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </form>
  );
}
