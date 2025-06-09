"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/types/order";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { getOrders, updateOrderStatus } from "@/lib/actions/order";
import { ORDER_STATUS, OrderStatus } from "@/lib/types/order-status";

interface OrderListProps {
  isAdmin?: boolean;
  userId?: string;
}

export default function OrderList({ isAdmin = false, userId }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(userId);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleStatusUpdate = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    // Optimistically update the UI
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Error updating order status:", err);
      // Revert optimistic update on error
      await fetchOrders();
      setError("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && orders.length === 0) {
    return <div className="text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center">No orders found.</div>;
  }

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case ORDER_STATUS.PENDING:
        return ORDER_STATUS.CONFIRMED;
      case ORDER_STATUS.CONFIRMED:
        return ORDER_STATUS.PREPARING;
      case ORDER_STATUS.PREPARING:
        return ORDER_STATUS.DELIVERED;
      case ORDER_STATUS.DELIVERED:
      case ORDER_STATUS.CANCELLED:
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Order #{order.id}</h3>
              <p>Total: {formatPrice(order.total)}</p>
              <Badge
                className={
                  order.status === ORDER_STATUS.DELIVERED
                    ? "bg-green-500 hover:bg-green-600"
                    : ""
                }
              >
                {order.status}
              </Badge>
            </div>
            {isAdmin &&
              order.status !== ORDER_STATUS.DELIVERED &&
              order.status !== ORDER_STATUS.CANCELLED && (
                <Button
                  onClick={() => {
                    const nextStatus = getNextStatus(
                      order.status as OrderStatus
                    );
                    if (nextStatus) {
                      handleStatusUpdate(order.id, nextStatus);
                    }
                  }}
                  size="sm"
                >
                  Mark as {getNextStatus(order.status as OrderStatus)}
                </Button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
