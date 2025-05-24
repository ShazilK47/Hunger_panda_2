"use client";

import AdminOrderList from "@/components/order/admin-order-list";

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
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
