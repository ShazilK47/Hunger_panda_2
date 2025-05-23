import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { PrismaOrderResult } from "@/lib/actions/order";

export async function GET() {
  try {
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

    const formattedOrders = orders.map((order: PrismaOrderResult) => ({
      id: order.id,
      user: order.user,
      status: order.status,
      total: order.totalAmount,
      items: order.items.map((item: PrismaOrderResult["items"][0]) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("[GET /api/admin/orders]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
