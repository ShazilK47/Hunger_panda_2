import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { Order, CreateOrderInput } from "@/lib/types/order";
import { OrderStatus } from "@/lib/types/order-status";
import { Decimal } from "@prisma/client/runtime/library";

type OrderItemResult = {
  id: string;
  menuItemId: string;
  orderId: string;
  quantity: number;
  price: Decimal;
  menuItem: {
    name: string;
    price: Decimal;
  };
};

// Helper to convert decimal values to numbers
const convertDecimalToNumber = (decimal: Decimal | number): number => {
  if (decimal instanceof Decimal) {
    return decimal.toNumber();
  }
  return decimal as number;
};

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
    type DbOrder = {
      id: string;
      userId: string;
      status: string;
      totalAmount: Decimal;
      deliveryAddress: string;
      paymentMethod: string;
      createdAt: Date;
      updatedAt: Date;
      items: OrderItemResult[];
    };

    // Convert orders to proper format
    const formattedOrders = orders.map(
      (order: DbOrder) =>
        ({
          id: order.id,
          userId: order.userId,
          status: order.status as OrderStatus,
          total: convertDecimalToNumber(order.totalAmount),
          items: order.items.map((item: OrderItemResult) => ({
            id: item.id,
            menuItemId: item.menuItemId,
            name: item.menuItem.name,
            quantity: item.quantity,
            price: convertDecimalToNumber(item.price),
          })),
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        } as Order)
    );

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
    } // Calculate total amount
    const totalAmount = data.items.reduce((acc, item) => {
      const menuItem = menuItems.find(
        (mi: { id: string; price: Decimal }) => mi.id === item.menuItemId
      );
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }
      return acc + convertDecimalToNumber(menuItem.price) * item.quantity;
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
              (mi: { id: string; price: Decimal }) => mi.id === item.menuItemId
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
            menuItem: true,
          },
        },
      },
    });

    // Convert order response to proper format
    return NextResponse.json({
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      total: convertDecimalToNumber(order.totalAmount),
      items: order.items.map((item: OrderItemResult) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: convertDecimalToNumber(item.price),
      })),
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    } as Order);
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
