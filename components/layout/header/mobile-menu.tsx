"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Navigation links
  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/restaurants", label: "Restaurants", icon: "🍽️" },
    { href: "/cart", label: "Cart", icon: "🛒" },
  ];

  // User links only shown when authenticated
  const userLinks = session
    ? [
        { href: "/profile", label: "My Profile", icon: "👤" },
        { href: "/orders", label: "My Orders", icon: "📦" },
      ]
    : [];

  // Admin links only shown when user is admin
  const adminLinks = session?.user?.isAdmin
    ? [{ href: "/admin", label: "Admin Dashboard", icon: "⚙️" }]
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div className="absolute top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <span className="text-2xl">🐼</span>
            <span className="font-serif text-lg font-bold text-primary tracking-tight">
              Hunger Panda
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close menu"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Main navigation */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3 text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User section - only shown when authenticated */}
          {session && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                Your Account
              </h3>
              <div className="mb-4 px-3 py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-primary">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col space-y-1">
                {userLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Admin section - only shown when user is admin */}
          {adminLinks.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                Admin
              </h3>
              <nav className="flex flex-col space-y-1">
                {adminLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer with login/logout */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          {!session ? (
            <div className="flex flex-col space-y-2">
              {" "}
              <Link
                href="/login"
                onClick={onClose}
                className="w-full py-2 px-3 text-center rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
              >
                Log in
              </Link>{" "}
              <Link
                href="/register"
                onClick={onClose}
                className="w-full py-2 px-3 text-center rounded-md bg-primary text-black hover:bg-primary/90 font-medium shadow-sm transition-all"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div>
              {" "}
              <LogoutButton
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
