"use server";

import { prisma } from "@/lib/db/prisma";
import { MenuItem, MenuItemFormData } from "@/lib/types/menu";
import { revalidatePath } from "next/cache";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Define PrismaMenuItem as the return type from prisma.menuItem queries
type PrismaMenuItem = NonNullable<
  Awaited<ReturnType<typeof prisma.menuItem.findFirst>>
>;

// Custom error class for menu item operations
class MenuItemError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "MenuItemError";
  }
}

/**
 * Helper function to convert Prisma MenuItem to our MenuItem type
 * This handles the price conversion from Decimal to number
 */
const convertPrismaMenuItemToMenuItem = (item: PrismaMenuItem): MenuItem => {
  // Make sure the price is properly converted from Decimal to a JavaScript number
  return {
    id: item.id,
    name: item.name,
    description: item.description || "",
    price:
      typeof item.price === "object"
        ? parseFloat(item.price.toString())
        : typeof item.price === "string"
        ? parseFloat(item.price)
        : Number(item.price),
    category: item.category,
    imageUrl: item.imageUrl || "",
    restaurantId: item.restaurantId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

/**
 * Helper to check if an error is a Prisma error with specific code
 */
const isPrismaError = (
  error: unknown,
  code: string
): error is PrismaClientKnownRequestError => {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === code
  );
};

/**
 * Validate menu item data before create/update
 */
const validateMenuItemData = (data: MenuItemFormData): void => {
  if (!data.name || data.name.trim().length < 2) {
    throw new MenuItemError(
      "Name must be at least 2 characters long",
      "INVALID_NAME"
    );
  }
  if (data.price <= 0) {
    throw new MenuItemError("Price must be greater than 0", "INVALID_PRICE");
  }
  if (!data.category || data.category.trim().length === 0) {
    throw new MenuItemError("Category is required", "INVALID_CATEGORY");
  }
  if (!data.restaurantId) {
    throw new MenuItemError("Restaurant ID is required", "INVALID_RESTAURANT");
  }
};

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
    throw new MenuItemError("Failed to fetch menu items", "FETCH_FAILED");
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
    throw new MenuItemError("Failed to fetch menu items", "FETCH_FAILED");
  }
}

/**
 * Get menu item by ID
 */
export async function getMenuItemById(
  id: string | number
): Promise<MenuItem | null> {
  try {
    // Convert id to number if it's a string
    const menuItemId = typeof id === "string" ? parseInt(id) : id;

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });
    return menuItem ? convertPrismaMenuItemToMenuItem(menuItem) : null;
  } catch (error) {
    console.error(`Error fetching menu item ${id}:`, error);
    throw new MenuItemError("Failed to fetch menu item", "FETCH_FAILED");
  }
}

/**
 * Create a new menu item (admin only)
 */
export async function createMenuItem(
  data: MenuItemFormData
): Promise<MenuItem> {
  try {
    validateMenuItemData(data);

    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: data.price,
        category: data.category.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        restaurantId: data.restaurantId,
      },
    });

    revalidatePath(`/restaurants/${data.restaurantId}`);
    revalidatePath("/admin/menu-items");

    return convertPrismaMenuItemToMenuItem(menuItem);
  } catch (error) {
    if (error instanceof MenuItemError) {
      throw error;
    }
    if (isPrismaError(error, "P2002")) {
      throw new MenuItemError(
        "A menu item with this name already exists",
        "DUPLICATE_NAME"
      );
    }
    console.error("Error creating menu item:", error);
    throw new MenuItemError("Failed to create menu item", "CREATE_FAILED");
  }
}

/**
 * Update an existing menu item (admin only)
 */
export async function updateMenuItem(
  id: string | number,
  data: MenuItemFormData
): Promise<MenuItem> {
  try {
    validateMenuItemData(data);

    // Convert id to number if it's a string
    const menuItemId = typeof id === "string" ? parseInt(id) : id;
    // Convert restaurantId to number if it's a string
    const restaurantId =
      typeof data.restaurantId === "string"
        ? parseInt(data.restaurantId)
        : data.restaurantId;

    const menuItem = await prisma.menuItem.update({
      where: { id: menuItemId },
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        price: data.price,
        category: data.category.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        restaurantId: restaurantId,
      },
    });

    revalidatePath(`/restaurants/${data.restaurantId}`);
    revalidatePath("/admin/menu-items");

    return convertPrismaMenuItemToMenuItem(menuItem);
  } catch (error) {
    if (error instanceof MenuItemError) {
      throw error;
    }
    if (isPrismaError(error, "P2002")) {
      throw new MenuItemError(
        "A menu item with this name already exists",
        "DUPLICATE_NAME"
      );
    }
    if (isPrismaError(error, "P2025")) {
      throw new MenuItemError("Menu item not found", "NOT_FOUND");
    }
    console.error(`Error updating menu item ${id}:`, error);
    throw new MenuItemError("Failed to update menu item", "UPDATE_FAILED");
  }
}

/**
 * Delete a menu item (admin only)
 */
export async function deleteMenuItem(id: string | number): Promise<void> {
  try {
    // Convert id to number if it's a string
    const menuItemId = typeof id === "string" ? parseInt(id) : id;

    // First, check if the menu item exists
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        orderItems: {
          take: 1, // We only need to know if there are any, not all of them
        },
      },
    });

    if (!menuItem) {
      throw new MenuItemError("Menu item not found", "NOT_FOUND");
    }

    // Check if there are any order items referencing this menu item
    if (menuItem.orderItems && menuItem.orderItems.length > 0) {
      throw new MenuItemError(
        "Cannot delete menu item because it is referenced by orders. Consider disabling it instead.",
        "FOREIGN_KEY_CONSTRAINT"
      );
    }

    // Safe to delete since there are no references
    await prisma.menuItem.delete({
      where: { id },
    });

    revalidatePath(`/restaurants/${menuItem.restaurantId}`);
    revalidatePath("/admin/menu-items");
  } catch (error) {
    if (error instanceof MenuItemError) {
      throw error;
    }
    if (isPrismaError(error, "P2025")) {
      throw new MenuItemError("Menu item not found", "NOT_FOUND");
    }
    if (isPrismaError(error, "P2003")) {
      // P2003 is the foreign key constraint error code
      throw new MenuItemError(
        "Cannot delete menu item because it is referenced by orders.",
        "FOREIGN_KEY_CONSTRAINT"
      );
    }
    console.error(`Error deleting menu item ${id}:`, error);
    throw new MenuItemError("Failed to delete menu item", "DELETE_FAILED");
  }
}

/**
 * Get menu items by category
 */
export async function getMenuItemsByCategory(
  category: string,
  restaurantId?: string
): Promise<MenuItem[]> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category,
        ...(restaurantId && { restaurantId }),
      },
      orderBy: {
        name: "asc",
      },
    });
    return menuItems.map(convertPrismaMenuItemToMenuItem);
  } catch (error) {
    console.error(`Error fetching menu items for category ${category}:`, error);
    throw new MenuItemError(
      "Failed to fetch menu items by category",
      "FETCH_FAILED"
    );
  }
}

/**
 * Get popular menu items for homepage with optional category filter
 */
export async function getPopularMenuItems(
  limit: number = 4,
  category?: string
): Promise<MenuItem[]> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: category ? { category } : undefined,
      orderBy: {
        createdAt: "desc", // Using creation date as a proxy for popularity
      },
      take: limit,
    });

    return menuItems.map(convertPrismaMenuItemToMenuItem);
  } catch (error) {
    console.error("Error fetching popular menu items:", error);
    throw new MenuItemError(
      "Failed to fetch popular menu items",
      "FETCH_FAILED"
    );
  }
}
