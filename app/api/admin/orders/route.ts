/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { PrismaOrderResult } from "@/lib/actions/order";
import { convertPrismaOrder } from "@/lib/utils/prisma";
import { isAdmin } from "@/lib/auth/session";
import { OrderStatus } from "@/lib/types/order-status";

export async function GET() {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
            menuItem: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order: PrismaOrderResult) => {
      const converted = convertPrismaOrder(order);
      return {
        id: order.id,
        user: order.user,
        status: order.status as OrderStatus,
        total: converted.totalAmount,
        items: converted.items.map((item: any) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("[GET /api/admin/orders]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
