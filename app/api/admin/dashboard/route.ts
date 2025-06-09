import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isAdmin } from "@/lib/auth/session";

export async function GET() {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const [totalOrders, totalRestaurants, totalMenuItems, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.restaurant.count(),
        prisma.menuItem.count(),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
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
                  },
                },
              },
            },
          },
        }),
      ]);

    // Calculate total amount for each order
    const processedOrders = recentOrders.map((order) => {
      const totalAmount = order.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      return {
        id: order.id,
        status: order.status,
        totalAmount,
        user: order.user,
        createdAt: order.createdAt,
      };
    });

    return NextResponse.json({
      totalOrders,
      totalRestaurants,
      totalMenuItems,
      recentOrders: processedOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
