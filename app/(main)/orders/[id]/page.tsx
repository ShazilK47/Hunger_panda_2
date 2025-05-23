"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order";
import { Order } from "@/lib/types/order";
import { formatCurrency } from "@/lib/utils/format";

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const unwrappedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(unwrappedParams.id);
        if (!orderData) {
          return notFound();
        }
        setOrder(orderData);
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
  }, [unwrappedParams.id]);

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
          <Link href="/orders">
            <Button variant="outline">View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return notFound();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link href="/orders">
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
              View All Orders
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p>
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">
                  {formatCurrency(
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Delivery Fee</p>
                <p className="font-medium">{formatCurrency(0)}</p>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <p>Total</p>
                <p>
                  {formatCurrency(
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <h2 className="text-lg font-semibold mb-4">
                Delivery Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">Delivery Address:</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
