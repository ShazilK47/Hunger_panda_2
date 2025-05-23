"use client";

import { useState, useEffect, useCallback } from "react";
import { Order } from "@/lib/types/order";
import { formatPrice } from "@/lib/utils/format";
import { getOrders, updateOrderStatus } from "@/lib/actions/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/lib/types/order-status";
import { format, formatDistanceToNow } from "date-fns";

type SortField = "id" | "createdAt" | "status" | "total";
type SortOrder = "asc" | "desc";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export default function AdminOrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [sortField, setSortField] = useState<SortField>(() => {
    // Restore sort preferences from localStorage
    const savedField = localStorage.getItem("adminOrdersSortField");
    return (savedField as SortField) || "createdAt";
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const savedOrder = localStorage.getItem("adminOrdersSortOrder");
    return (savedOrder as SortOrder) || "desc";
  });

  // Save sort preferences when they change
  useEffect(() => {
    localStorage.setItem("adminOrdersSortField", sortField);
    localStorage.setItem("adminOrdersSortOrder", sortOrder);
  }, [sortField, sortOrder]);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Failed to load orders. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    // Validate status transition
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const validTransitions = VALID_STATUS_TRANSITIONS[order.status];
    if (!validTransitions.includes(newStatus)) {
      toast({
        title: "Invalid Status Change",
        description: `Cannot change order status from ${
          ORDER_STATUS_LABELS[order.status]
        } to ${ORDER_STATUS_LABELS[newStatus]}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingOrderIds((prev) => new Set(prev).add(orderId));
      // Optimistic update
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Success",
        description: `Order status updated to ${ORDER_STATUS_LABELS[newStatus]}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      await loadOrders(); // Revert to actual state on error
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  const handleBulkUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      for (const orderId of selectedOrderIds) {
        await updateOrderStatus(orderId, newStatus);
      }
      toast({
        title: "Success",
        description: `Selected orders updated to ${ORDER_STATUS_LABELS[newStatus]}`,
      });
      setSelectedOrderIds(new Set());
      loadOrders();
    } catch (error) {
      console.error("Error updating order statuses:", error);
      toast({
        title: "Error",
        description: "Failed to update order statuses. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const sortOrders = (orders: Order[]): Order[] => {
    return [...orders].sort((a, b) => {
      if (sortField === "createdAt") {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return sortOrder === "desc"
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      }
      if (sortField === "total") {
        return sortOrder === "desc" ? b.total - a.total : a.total - b.total;
      }
      if (sortField === "id" || sortField === "status") {
        const aValue = a[sortField];
        const bValue = b[sortField];
        return sortOrder === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      return 0;
    });
  };

  const filteredOrders = orders.filter((order) => {
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = sortOrders(filteredOrders);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrderIds.size === sortedOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(sortedOrders.map((order) => order.id)));
    }
  };

  const handleExportOrders = () => {
    const ordersToExport =
      selectedOrderIds.size > 0
        ? sortedOrders.filter((order) => selectedOrderIds.has(order.id))
        : sortedOrders;

    const csv = [
      // Header
      ["Order ID", "Date", "Status", "Total", "Items", "Delivery Address"].join(
        ","
      ),
      // Data rows
      ...ordersToExport.map((order) =>
        [
          order.id,
          format(new Date(order.createdAt), "PPp"),
          ORDER_STATUS_LABELS[order.status],
          formatPrice(order.total).replace(/,/g, ""),
          order.items
            .map((item) => `${item.quantity}x ${item.name}`)
            .join("; "),
          order.deliveryAddress,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
        <p>{error}</p>
        <Button
          onClick={() => loadOrders()}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        {/* Bulk Actions */}
        {selectedOrderIds.size > 0 && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              {selectedOrderIds.size} orders selected
            </span>
            <select
              className="rounded-md border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              onChange={(e) =>
                handleBulkUpdateStatus(e.target.value as OrderStatus)
              }
              defaultValue=""
            >
              <option value="" disabled>
                Update Status...
              </option>
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={handleExportOrders}>
              Export Selected
            </Button>
          </div>
        )}

        {/* Existing Search and Filter */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by order ID or item name..."
            className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedOrderIds(new Set());
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>

        <div className="flex-shrink-0">
          <select
            className="w-full md:w-auto px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "all");
              setSelectedOrderIds(new Set());
            }}
          >
            <option value="all">All Statuses</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {" "}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  checked={
                    selectedOrderIds.size > 0 &&
                    selectedOrderIds.size === sortedOrders.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center space-x-1">
                  <span>Order ID</span>
                  {sortField === "id" && (
                    <span className="text-gray-400">
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order Items
              </th>
              <th
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center space-x-1">
                  <span>Total</span>
                  {sortField === "total" && (
                    <span className="text-gray-400">
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {sortField === "status" && (
                    <span className="text-gray-400">
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortField === "createdAt" && (
                    <span className="text-gray-400">
                      {sortOrder === "asc" ? " ↑" : " ↓"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <p className="text-xl text-gray-600">No orders found</p>
                  <p className="text-gray-500 mt-2">
                    Try a different search term or status filter!
                  </p>
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className={
                    updatingOrderIds.has(order.id) ? "bg-gray-50" : undefined
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      checked={selectedOrderIds.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-1">
                          <span>{item.quantity}x</span>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500">
                            ({formatPrice(item.price)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{format(new Date(order.createdAt), "PPp")}</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      {order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED" && (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            disabled={updatingOrderIds.has(order.id)}
                            className="rounded-md border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value={order.status}>
                              {ORDER_STATUS_LABELS[order.status]}
                            </option>
                            {VALID_STATUS_TRANSITIONS[order.status].map(
                              (status) => (
                                <option key={status} value={status}>
                                  {ORDER_STATUS_LABELS[status]}
                                </option>
                              )
                            )}
                          </select>
                        )}
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
