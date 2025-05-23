"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { CreateOrderInput, Order } from "../types/order";
import { authOptions } from "../auth/options";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderStatus } from "../types/order-status";
import { MenuItem } from "../types/menu";

// Define a type for Prisma's order result
export type PrismaOrderResult = {
  id: string;
  userId: string;
  status: string;
  totalAmount: Decimal | number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
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
    };
  }>;
};

// Helper function to convert Decimal to number
const convertDecimalToNumber = (decimal: Decimal | number): number => {
  if (decimal instanceof Decimal) {
    return decimal.toNumber();
  }
  return decimal as number;
};

// Helper to convert Prisma types to our proper Order type
const convertPrismaOrderToOrderType = (order: PrismaOrderResult): Order => {
  return {
    id: order.id,
    userId: order.userId,
    status: order.status as OrderStatus,
    total: convertDecimalToNumber(order.totalAmount),
    items: order.items.map((item: PrismaOrderResult["items"][0]) => ({
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
  };
};

export async function getOrders(userId?: string): Promise<Order[]> {
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
      where: userId ? { userId } : undefined,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(
      (order: PrismaOrderResult): Order => ({
        id: order.id,
        userId: order.userId,
        status: order.status as OrderStatus,
        total: convertDecimalToNumber(order.totalAmount),
        items: order.items.map((item: PrismaOrderResult["items"][0]) => ({
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
      })
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

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
    } // Calculate total amount
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: input.items.map(
            (item: CreateOrderInput["items"][0]) => item.menuItemId
          ),
        },
      },
    });

    const itemsWithPrices = input.items.map(
      (item: CreateOrderInput["items"][0]) => {
        const menuItem = menuItems.find(
          (mi: MenuItem) => mi.id === item.menuItemId
        );
        if (!menuItem) {
          throw new Error(`Menu item not found: ${item.menuItemId}`);
        }
        return {
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
        };
      }
    );
    type OrderItemWithPrice = {
      menuItemId: string;
      quantity: number;
      price: Decimal | number;
    };

    const totalAmount = itemsWithPrices.reduce(
      (acc: number, item: OrderItemWithPrice) =>
        acc + convertDecimalToNumber(item.price) * item.quantity,
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
          create: itemsWithPrices.map((item) => ({
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
    revalidatePath("/admin/orders");

    return {
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      total: convertDecimalToNumber(order.totalAmount),
      items: order.items.map(
        (item: {
          id: string;
          menuItemId: string;
          quantity: number;
          price: Decimal | number;
          menuItem: {
            name: string;
          };
        }) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: convertDecimalToNumber(item.price),
          name: item.menuItem.name,
        })
      ),
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    } as Order;
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
  status: OrderStatus
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

    revalidatePath("/admin/orders");
    revalidatePath("/orders");
    return convertPrismaOrderToOrderType(order as PrismaOrderResult);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}
