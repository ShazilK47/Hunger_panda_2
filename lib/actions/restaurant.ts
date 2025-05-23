"use server";

import { prisma } from "@/lib/db/prisma";
import { Restaurant, RestaurantFormData } from "@/lib/types/restaurant";
import { revalidatePath } from "next/cache";
import { RestaurantError, ValidationError } from "@/lib/types/errors";
import { isAdmin } from "@/lib/auth/session";

// Validation functions
function validateRestaurantData(data: RestaurantFormData) {
  // Required fields
  if (!data.name?.trim() || data.name.length < 2) {
    throw new ValidationError(
      "Restaurant name must be at least 2 characters",
      "name"
    );
  }
  if (data.name.length > 255) {
    throw new ValidationError(
      "Restaurant name cannot exceed 255 characters",
      "name"
    );
  }
  if (!data.address?.trim() || data.address.length < 5) {
    throw new ValidationError(
      "Address must be at least 5 characters",
      "address"
    );
  }

  // Clean and validate phone number
  if (data.phone) {
    const cleanPhone = data.phone.trim().replace(/[^\d+]/g, "");
    if (cleanPhone) {
      if (cleanPhone.length > 20) {
        throw new ValidationError(
          "Phone number cannot exceed 20 characters",
          "phone"
        );
      }
      if (!/^\+?\d{10,20}$/.test(cleanPhone)) {
        throw new ValidationError(
          "Phone number must be between 10 and 20 digits",
          "phone"
        );
      }
      // Update to cleaned version
      data.phone = cleanPhone;
    } else {
      data.phone = null;
    }
  }

  // Handle optional text fields
  if (data.description) {
    data.description = data.description.trim() || null;
  }

  if (data.cuisine) {
    const cleanCuisine = data.cuisine.trim();
    if (cleanCuisine) {
      if (cleanCuisine.length > 100) {
        throw new ValidationError(
          "Cuisine type cannot exceed 100 characters",
          "cuisine"
        );
      }
      data.cuisine = cleanCuisine;
    } else {
      data.cuisine = null;
    }
  }

  if (data.imageUrl) {
    const cleanUrl = data.imageUrl.trim();
    if (cleanUrl) {
      if (!/^https?:\/\/.+/.test(cleanUrl)) {
        throw new ValidationError("Invalid image URL format", "imageUrl");
      }
      data.imageUrl = cleanUrl;
    } else {
      data.imageUrl = null;
    }
  }
}

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
              { cuisine: { contains: searchQuery } },
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
    throw new RestaurantError("Failed to fetch restaurants", "FETCH_FAILED");
  }
}

/**
 * Get restaurant by ID
 */
export async function getRestaurantById(id: string): Promise<Restaurant> {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: true,
      },
    });

    if (!restaurant) {
      throw new RestaurantError("Restaurant not found", "NOT_FOUND");
    }

    return restaurant;
  } catch (error) {
    if (error instanceof RestaurantError) {
      throw error;
    }
    console.error(`Error fetching restaurant ${id}:`, error);
    throw new RestaurantError("Failed to fetch restaurant", "FETCH_FAILED");
  }
}

/**
 * Create a new restaurant (admin only)
 */
export async function createRestaurant(
  data: RestaurantFormData
): Promise<Restaurant> {
  try {
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      throw new RestaurantError("Not authorized", "UNAUTHORIZED");
    }
    validateRestaurantData(data);

    // After validation, data fields are either clean strings or null
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name.trim(),
        description: data.description ?? null,
        address: data.address.trim(),
        imageUrl: data.imageUrl ?? null,
        phone: data.phone ?? null,
        cuisine: data.cuisine ?? null,
      },
    });

    revalidatePath("/restaurants");
    revalidatePath("/admin/restaurants");

    return restaurant;
  } catch (error) {
    if (error instanceof RestaurantError || error instanceof ValidationError) {
      throw error;
    }
    console.error("Error creating restaurant:", error);
    throw new RestaurantError("Failed to create restaurant", "DATABASE_ERROR");
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
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      throw new RestaurantError("Not authorized", "UNAUTHORIZED");
    }

    validateRestaurantData(data);

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        imageUrl: data.imageUrl || null,
        phone: data.phone || null,
        cuisine: data.cuisine || null,
      },
    });

    revalidatePath("/restaurants");
    revalidatePath(`/restaurants/${id}`);
    revalidatePath("/admin/restaurants");

    return restaurant;
  } catch (error) {
    if (error instanceof RestaurantError || error instanceof ValidationError) {
      throw error;
    }
    console.error(`Error updating restaurant ${id}:`, error);
    throw new RestaurantError("Failed to update restaurant", "DATABASE_ERROR");
  }
}

/**
 * Delete a restaurant (admin only)
 */
export async function deleteRestaurant(id: string): Promise<void> {
  try {
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      throw new RestaurantError("Not authorized", "UNAUTHORIZED");
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    revalidatePath("/restaurants");
    revalidatePath("/admin/restaurants");
  } catch (error) {
    if (error instanceof RestaurantError) {
      throw error;
    }
    console.error(`Error deleting restaurant ${id}:`, error);
    throw new RestaurantError("Failed to delete restaurant", "DATABASE_ERROR");
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
    // For now, we'll simply return random restaurants
    const restaurants = await prisma.restaurant.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    return restaurants;
  } catch (error) {
    console.error("Error fetching popular restaurants:", error);
    throw new Error("Failed to fetch popular restaurants");
  }
}
