"use client";

import { useState, useEffect } from "react";
import AdminOrderList from "@/components/order/admin-order-list";
import { getStorageItem, setStorageItem } from "@/lib/utils/storage";

export default function AdminOrders() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Initialize filter state from localStorage on client-side only
  useEffect(() => {
    const savedFilter = getStorageItem<string>("adminOrderFilter", "all");
    setActiveFilter(savedFilter);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = e.target.value;
    setActiveFilter(newFilter);
    setStorageItem("adminOrderFilter", newFilter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={activeFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Processing</option>
            <option value="DELIVERED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      {/* Orders List with admin capabilities */}{" "}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <AdminOrderList initialFilter={activeFilter} />
        </div>
      </div>
    </div>
  );
}
