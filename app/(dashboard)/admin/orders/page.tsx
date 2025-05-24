"use client";

import AdminOrderList from "@/components/order/admin-order-list";

export default function AdminOrders() {
  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      {/* Orders List with admin capabilities */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <AdminOrderList />
        </div>
      </div>
    </div>
  );
}
