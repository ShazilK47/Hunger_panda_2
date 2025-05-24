/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { isAdmin } from "@/lib/auth/session";
import { Order } from "@/lib/types/order";
import { OrderStatus } from "@/lib/types/order-status";
import { convertPrismaOrder } from "@/lib/utils/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { status } = data;

    // Validate the status
    const validStatuses: OrderStatus[] = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    try {
      // Update the order
      const updatedOrder = await prisma.order.update({
        where: {
          id: params.id,
        },
        data: {
          status,
        },
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
      });

      // Convert decimal values to regular numbers
      const converted = convertPrismaOrder(updatedOrder);
      const response: Order = {
        id: updatedOrder.id,
        userId: updatedOrder.userId,
        status: updatedOrder.status as OrderStatus,
        total: converted.totalAmount,
        items: converted.items.map((item: any) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress: updatedOrder.deliveryAddress,
        paymentMethod: updatedOrder.paymentMethod,
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt,
      };

      return NextResponse.json(response);
    } catch (error) {
      console.error("Error updating order:", error);
      if (error instanceof PrismaClientKnownRequestError) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[PATCH /api/orders/:id]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
