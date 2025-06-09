"use server";

import { prisma } from "@/lib/db/prisma";
import { LoginData, RegisterData } from "@/lib/types/auth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
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

// Login functionality
export async function login(data: LoginData) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password" };
    }

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }
}

// Register functionality
export async function register(data: RegisterData) {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message };
  }

  try {
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user - with detailed error logging
    try {
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
      });

      console.log("User created successfully:", newUser.id);
      return { success: true };
    } catch (createError) {
      console.error("Error creating user:", createError);
      return { error: "Error creating user account. Please try again." };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

// Logout functionality
export async function logout() {
  // We can't use signOut directly in a server action,
  // so we just redirect to the home page
  redirect("/");
}
