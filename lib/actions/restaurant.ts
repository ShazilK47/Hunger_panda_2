"use server";

import { prisma } from "@/lib/db/prisma";
import { Restaurant, RestaurantFormData } from "@/lib/types/restaurant";
import { revalidatePath } from "next/cache";

/**
 * Get all restaurants with optional search term
 */
export async function getRestaurants(
  searchTerm?: string
): Promise<Restaurant[]> {
  try {
    const searchQuery = searchTerm?.toLowerCase() || "";
    const restaurants = await prisma.restaurant.findMany({
      where: searchQuery
        ? {
            OR: [
              { name: { contains: searchQuery } },
              { description: { contains: searchQuery } },
              { address: { contains: searchQuery } },
            ],
          }
        : undefined,
      orderBy: {
        name: "asc",
      },
    });

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw new Error("Failed to fetch restaurants");
  }
}

/**
 * Get restaurant by ID
 */
export async function getRestaurantById(
  id: string
): Promise<Restaurant | null> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true, // Include menu items
      },
    });
    return restaurant;
  } catch (error) {
    console.error(`Error fetching restaurant ${id}:`, error);
    throw new Error("Failed to fetch restaurant");
  }
}

/**
 * Create a new restaurant (admin only)
 */
export async function createRestaurant(
  data: RestaurantFormData
): Promise<Restaurant> {
  try {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidatePath("/restaurants");
    revalidatePath("/admin/restaurants");

    return restaurant;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw new Error("Failed to create restaurant");
  }
}

/**
 * Update an existing restaurant (admin only)
 */
export async function updateRestaurant(
  id: string,
  data: RestaurantFormData
): Promise<Restaurant> {
  try {
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        imageUrl: data.imageUrl || null,
      },
    });

    revalidatePath("/restaurants");
    revalidatePath(`/restaurants/${id}`);
    revalidatePath("/admin/restaurants");
    revalidatePath(`/admin/restaurants/${id}/edit`);

    return restaurant;
  } catch (error) {
    console.error(`Error updating restaurant ${id}:`, error);
    throw new Error("Failed to update restaurant");
  }
}

/**
 * Delete a restaurant (admin only)
 */
export async function deleteRestaurant(id: string): Promise<void> {
  try {
    await prisma.restaurant.delete({
      where: { id },
    });

    revalidatePath("/restaurants");
    revalidatePath("/admin/restaurants");
  } catch (error) {
    console.error(`Error deleting restaurant ${id}:`, error);
    throw new Error("Failed to delete restaurant");
  }
}

/**
 * Get popular restaurants for homepage
 */
export async function getPopularRestaurants(
  limit: number = 3
): Promise<Restaurant[]> {
  try {
    // In a real application, this would likely be based on order counts, ratings, etc.
    // For now, we'll simply return the most recently added restaurants
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching popular restaurants:", error);
    throw new Error("Failed to fetch popular restaurants");
  }
}
