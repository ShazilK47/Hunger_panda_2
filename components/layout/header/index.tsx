"use client";

import { useState } from "react";
import Link from "next/link";
import UserNav from "./user-nav";
import MainNav from "./main-nav";
import MobileMenu from "./mobile-menu";
import { CartButton } from "@/components/cart/cart-button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and MainNav */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary flex items-center gap-2 mr-2 md:mr-8"
            >
              <span className="text-3xl">🐼</span>
              <span className="font-serif tracking-tight">Hunger Panda</span>
            </Link>
            <div className="hidden md:block">
              <MainNav />
            </div>
          </div>

          {/* Right side: Cart, User, Hamburger */}
          <div className="flex items-center gap-2 md:gap-4">
            <CartButton />
            <div className="hidden md:block">
              <UserNav />
            </div>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - imported from separate component */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
