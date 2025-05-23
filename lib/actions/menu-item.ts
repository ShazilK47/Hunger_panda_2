"use server";

import { prisma } from "@/lib/db/prisma";
import { MenuItem, MenuItemFormData } from "@/lib/types/menu";
import { revalidatePath } from "next/cache";
import { Prisma, MenuItem as PrismaMenuItem } from "@prisma/client";

// Helper function to convert Prisma Decimal to number
const convertPrismaMenuItemToMenuItem = (item: PrismaMenuItem): MenuItem => ({
  ...item,
  price:
    item.price instanceof Prisma.Decimal
      ? parseFloat(item.price.toString())
      : Number(item.price),
});

/**
 * Get all menu items
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return menuItems.map(convertPrismaMenuItemToMenuItem);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw new Error("Failed to fetch menu items");
  }
}

/**
 * Get menu items by restaurant ID
 */
export async function getMenuItemsByRestaurant(
  restaurantId: string
): Promise<MenuItem[]> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        restaurantId,
      },
      orderBy: {
        category: "asc",
      },
    });
    return menuItems.map(convertPrismaMenuItemToMenuItem);
  } catch (error) {
    console.error(
      `Error fetching menu items for restaurant ${restaurantId}:`,
      error
    );
    throw new Error("Failed to fetch menu items");
  }
}

/**
 * Get menu item by ID
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });
    return menuItem ? convertPrismaMenuItemToMenuItem(menuItem) : null;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw new Error("Failed to fetch menu item");
  }
}

/**
 * Create a new menu item (admin only)
 */
export async function createMenuItem(
  data: MenuItemFormData
): Promise<MenuItem> {
  try {
    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || null,
        restaurantId: data.restaurantId,
      },
    });

    revalidatePath(`/restaurants/${data.restaurantId}`);
    revalidatePath("/admin/menu-items");

    return convertPrismaMenuItemToMenuItem(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    throw new Error("Failed to create menu item");
  }
}

/**
 * Update an existing menu item (admin only)
 */
export async function updateMenuItem(
  id: string,
  data: MenuItemFormData
): Promise<MenuItem> {
  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || null,
        restaurantId: data.restaurantId,
      },
    });

    revalidatePath(`/restaurants/${data.restaurantId}`);
    revalidatePath("/admin/menu-items");

    return convertPrismaMenuItemToMenuItem(menuItem);
  } catch (error) {
    console.error(`Error updating menu item ${id}:`, error);
    throw new Error("Failed to update menu item");
  }
}

/**
 * Delete a menu item (admin only)
 */
export async function deleteMenuItem(id: string): Promise<void> {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      select: { restaurantId: true },
    });

    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    revalidatePath(`/restaurants/${menuItem.restaurantId}`);
    revalidatePath("/admin/menu-items");
  } catch (error) {
    console.error(`Error deleting menu item ${id}:`, error);
    throw new Error("Failed to delete menu item");
  }
}
