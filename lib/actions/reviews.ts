"use server";

import { prisma } from "@/lib/db/prisma";

export interface CustomerReview {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  avatarUrl?: string | null;
}

/**
 * Get featured reviews for the homepage hero section
 */
export async function getFeaturedReviews(
  limit: number = 1
): Promise<CustomerReview[]> {
  try {
    // In a real app, this would come from a reviews table in the database
    // For now, we'll return static data with a simulated delay to mimic API fetch

    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock reviews data
    const reviews: CustomerReview[] = [
      {
        id: "1",
        customerName: "Sarah Johnson",
        content:
          "The food delivery was prompt and the food was still hot when it arrived. Excellent service!",
        rating: 5,
        avatarUrl: null,
      },
      {
        id: "2",
        customerName: "Michael Chen",
        content:
          "I love how easy it is to order from multiple restaurants. The delivery was faster than expected!",
        rating: 5,
        avatarUrl: null,
      },
      {
        id: "3",
        customerName: "Emily Rodriguez",
        content:
          "Great selection of restaurants and the app is so easy to use. Will definitely order again!",
        rating: 4,
        avatarUrl: null,
      },
    ];

    // Return random reviews up to the limit
    return reviews.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Error fetching featured reviews:", error);
    throw new Error("Failed to fetch featured reviews");
  }
}
