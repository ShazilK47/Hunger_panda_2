/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";
import { OrderStatus } from "@/lib/types/order-status";

interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  user?: {
    name: string;
    email: string;
  };
}

interface DashboardStats {
  totalOrders: number;
  totalRestaurants: number;
  totalMenuItems: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRestaurants: 0,
    totalMenuItems: 0,
    recentOrders: [],
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">
            Total Orders
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">
            Restaurants
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
            {stats.totalRestaurants}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">
            Menu Items
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
            {stats.totalMenuItems}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Add recent orders here */}
                {Array.isArray(stats.recentOrders) &&
                stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user?.name || "Guest User"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "PREPARING"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.totalAmount || 0)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
