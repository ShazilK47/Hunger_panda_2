"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { Order, OrderItem } from "../types/order";
import { authOptions } from "../auth/options";
import { isAdmin } from "@/lib/auth/session";
import type { PrismaOrderResult } from "./order";
import { OrderStatus } from "../types/order-status";
import { convertPrismaOrder } from "../utils/prisma";

// Define a type for the converted order item
type ConvertedOrderItem = {
  id: string;
  menuItemId: string;
  price: number;
  quantity: number;
  menuItem: {
    name: string;
    price: number;
  };
};

export async function getAdminOrders(): Promise<Order[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to view orders");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      throw new Error("Unauthorized: Admin access required");
    }

    // Get all orders with related data
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order: PrismaOrderResult) => {
      const converted = convertPrismaOrder(order);
      return {
        id: order.id,
        userId: order.userId,
        status: order.status as OrderStatus,
        total: converted.totalAmount,
        items: converted.items.map(
          (item: ConvertedOrderItem) =>
            ({
              id: item.id,
              menuItemId: item.menuItemId,
              name: item.menuItem.name,
              quantity: item.quantity,
              price: item.price,
            } as OrderItem)
        ),
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    throw new Error("Failed to fetch admin orders");
  }
}
