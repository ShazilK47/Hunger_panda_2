"use client";

import AdminOrderList from "@/components/order/admin-order-list";

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {/* Orders List with admin capabilities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <AdminOrderList />
      </div>
    </div>
  );
}
