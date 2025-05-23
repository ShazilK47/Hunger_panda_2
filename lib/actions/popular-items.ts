/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/db/prisma";
import { MenuItem } from "@/lib/types/menu";

interface GetMenuItemsOptions {
  limit?: number;
  category?: string;
  restaurantId?: string;
  sortBy?: "price" | "createdAt" | "popular";
  sortOrder?: "asc" | "desc";
}

/**
 * Get popular menu items for homepage with advanced filtering options
 */
export async function getPopularMenuItems(
  limitOrOptions: number | GetMenuItemsOptions = 4
): Promise<MenuItem[]> {
  try {
    const options: GetMenuItemsOptions =
      typeof limitOrOptions === "number"
        ? { limit: limitOrOptions }
        : limitOrOptions;

    const {
      limit = 4,
      category,
      restaurantId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Build where clause for filtering
    const where: any = {};
    if (category) where.category = category;
    if (restaurantId) where.restaurantId = restaurantId;

    // Build orderBy based on sortBy option
    const orderBy: any = {};
    switch (sortBy) {
      case "price":
        orderBy.price = sortOrder;
        break;
      case "popular":
        // In a real app, this would use a popularity metric
        // For now, we're using createdAt as a proxy
        orderBy.createdAt = sortOrder;
        break;
      default:
        orderBy.createdAt = sortOrder;
    }

    // Fetch menu items with filters
    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy,
      take: limit,
    });

    // Convert Prisma decimal to regular number for price
    return menuItems.map((item: any) => ({
      ...item,
      price: parseFloat(item.price.toString()),
    }));
  } catch (error) {
    console.error("Error fetching popular menu items:", error);
    throw new Error("Failed to fetch popular menu items");
  }
}

/**
 * Get unique categories from menu items
 */
export async function getMenuCategories(): Promise<string[]> {
  try {
    const categories = await prisma.menuItem.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return categories.map((c: { category: string }) => c.category);
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    throw new Error("Failed to fetch menu categories");
  }
}

/**
 * Get menu items by search term (name and description)
 */
export async function searchMenuItems(
  searchTerm: string,
  limit: number = 8
): Promise<MenuItem[]> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive", // Case-insensitive search
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive", // Case-insensitive search
            },
          },
        ],
      },
      take: limit,
    });

    // Convert Prisma decimal to regular number for price
    return menuItems.map((item: any) => ({
      ...item,
      price: parseFloat(item.price.toString()),
    }));
  } catch (error) {
    console.error("Error searching menu items:", error);
    throw new Error("Failed to search menu items");
  }
}
