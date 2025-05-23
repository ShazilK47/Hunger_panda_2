"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order";
import { Order } from "@/lib/types/order";
import { formatCurrency } from "@/lib/utils/format";

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PREPARING":
      return "bg-purple-100 text-purple-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const orderData = await getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);
  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Link href="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
          <Link href="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find the order details you&apos;re looking for.
          </p>
          <Link href="/restaurants">
            <Button>Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="mx-auto h-16 w-16 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Thank you for your order. We&apos;ll start preparing it right
              away!
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-mono font-medium">{order.id}</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Delivery Fee</p>
                  <p className="font-medium">{formatCurrency(0)}</p>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <p>Total</p>
                  <p>{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 mb-1">Delivery Address</p>
                <p className="font-medium">{order.deliveryAddress}</p>
                <p className="text-gray-600 mt-4 mb-1">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href={`/orders/${orderId}`}>
              <Button className="w-full">View Order Details</Button>
            </Link>
            <Link href="/restaurants">
              <Button variant="outline" className="w-full">
                Browse More Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
