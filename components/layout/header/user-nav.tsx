"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/logout-button";

export default function UserNav() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-pill shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">{session?.user?.name}</span>
        {session?.user?.isAdmin && (
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            Admin
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {session?.user?.isAdmin && (
          <Link
            href="/dashboard/admin"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        )}

        <Link
          href="/dashboard/profile"
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          Profile
        </Link>

        <Link
          href="/orders"
          className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
        >
          My Orders
        </Link>

        <LogoutButton variant="ghost" size="sm" />
      </div>
    </div>
  );
}
