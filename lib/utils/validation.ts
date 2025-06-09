import { z } from "zod";

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional(),
});

// Restaurant validation schema
export const restaurantSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
});

// Menu item validation schema
export const menuItemSchema = z.object({
  name: z.string().min(2, "Item name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
  restaurantId: z.number().int().positive("Invalid restaurant ID"),
});

// Checkout validation schema
export const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be at least 5 characters"),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD"]),
  notes: z.string().optional(),
});
