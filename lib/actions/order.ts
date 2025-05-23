"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { CreateOrderInput, Order, OrderItem } from "../types/order";
import { authOptions } from "../auth/options";
import { Decimal } from "@prisma/client/runtime/library";

// Define a type for Prisma's order result
type PrismaOrderResult = {
  id: string;
  userId: string;
  status: string;
  totalAmount: Decimal | number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    menuItemId: string;
    orderId: string;
    quantity: number;
    price: Decimal | number;
    menuItem: {
      id: string;
      name: string;
      price: Decimal | number;
      imageUrl?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
};

// Helper function to convert Decimal to number
const convertDecimalToNumber = (value: Decimal | number | string): number => {
  if (typeof value === "object" && value !== null) {
    return parseFloat(value.toString());
  }
  return typeof value === "string" ? parseFloat(value) : Number(value);
};

// Helper to convert Prisma types to our proper Order type
const convertPrismaOrderToOrderType = (order: PrismaOrderResult): Order => {
  return {
    ...order,
    status: order.status as Order["status"], // Cast status to Order["status"]
    totalAmount: convertDecimalToNumber(order.totalAmount),
    items: order.items.map(
      (item): OrderItem => ({
        ...item,
        price: convertDecimalToNumber(item.price),
        menuItem: {
          ...item.menuItem,
          price: convertDecimalToNumber(item.menuItem.price),
        },
      })
    ),
  };
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to create an order");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const totalAmount = input.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        totalAmount,
        deliveryAddress: input.deliveryAddress,
        paymentMethod: input.paymentMethod,
        items: {
          create: input.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
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
    revalidatePath("/orders");
    revalidatePath(`/orders/${order.id}`);

    // Convert Decimal values to JavaScript numbers
    return convertPrismaOrderToOrderType(order as PrismaOrderResult);
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
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

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    // Convert Decimal values to numbers before returning to client components
    if (order) {
      return convertPrismaOrderToOrderType(order as PrismaOrderResult);
    }

    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function getUserOrders(): Promise<Order[]> {
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

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
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

    // Convert Decimal values to numbers before returning to client components
    return orders.map((order: PrismaOrderResult) =>
      convertPrismaOrderToOrderType(order)
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<Order> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("You must be logged in to update orders");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
        userId: user.id,
      },
      data: {
        status,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    // Convert Decimal values to numbers before returning to client components
    return convertPrismaOrderToOrderType(order as PrismaOrderResult);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order");
  }
}
