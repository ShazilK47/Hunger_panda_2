"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/logout-button";

export default function UserNav() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-sm font-semibold px-4 py-2 bg-primary text-black rounded-pill shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
        >
          Sign up
        </Link>
      </div>
    );
  }
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white bg-black rounded-b-full p-2">
            {session.user?.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
          {session.user?.name}
        </span>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {session?.user?.isAdmin && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">⚙️</span> Dashboard
              </Link>
            )}
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">👤</span> Profile
            </Link>
            <Link
              href="/orders"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <span className="mr-2">📦</span> My Orders
            </Link>
            <hr className="my-1" />
            <div className="px-4 py-2">
              {" "}
              <LogoutButton
                variant="ghost"
                size="sm"
                className="w-full text-left text-sm text-red-600 hover:text-red-700 flex items-center gap-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
