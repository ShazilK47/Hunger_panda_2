/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { Order, CreateOrderInput } from "@/lib/types/order";
import { OrderStatus } from "@/lib/types/order-status";
import { convertPrismaDecimal, convertPrismaOrder } from "@/lib/utils/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // For admin users, return all orders or filter by userId if provided
    const isAdminUser = await isAdmin();

    const orders = await prisma.order.findMany({
      where: isAdminUser
        ? userId
          ? { userId }
          : undefined
        : { userId: user.id },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert orders to proper format using helper
    const formattedOrders = orders.map((order: any) => {
      const converted = convertPrismaOrder(order);
      return {
        id: order.id,
        userId: order.userId,
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
      } as Order;
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("[GET /api/orders]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = (await request.json()) as CreateOrderInput;

    // Validate input
    if (!data.items?.length) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!data.deliveryAddress) {
      return NextResponse.json(
        { error: "Delivery address is required" },
        { status: 400 }
      );
    }

    if (!data.paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Fetch menu items to calculate prices
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.menuItemId),
        },
      },
    });

    if (menuItems.length !== data.items.length) {
      return NextResponse.json(
        { error: "One or more menu items not found" },
        { status: 400 }
      );
    }

    interface MenuItem {
      id: string;
      price: number | Decimal;
    }

    // Calculate total amount using the helper
    const totalAmount = data.items.reduce((acc, item) => {
      const menuItem = menuItems.find(
        (mi: MenuItem) => mi.id === item.menuItemId
      );
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }

      const price = convertPrismaDecimal(menuItem.price);
      if (price === null) {
        throw new Error(`Price is null for menu item: ${menuItem.id}`);
      }

      return acc + price * item.quantity;
    }, 0);

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        status: "PENDING" as OrderStatus,
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items.map((item) => {
            const menuItem = menuItems.find(
              (mi: any) => mi.id === item.menuItemId
            );
            if (!menuItem) {
              throw new Error(`Menu item not found: ${item.menuItemId}`);
            }
            return {
              quantity: item.quantity,
              menuItemId: item.menuItemId,
              price: menuItem.price,
            };
          }),
        },
      },
      include: {
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

    // Convert order response to proper format using helper
    const converted = convertPrismaOrder(order);
    const response: Order = {
      id: order.id,
      userId: order.userId,
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

    return NextResponse.json(response);
  } catch (error) {
    console.error("[POST /api/orders]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
