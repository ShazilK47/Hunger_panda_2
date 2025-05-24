"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "📊",
  },
  {
    href: "/admin/restaurants",
    label: "Restaurants",
    icon: "🏪",
  },
  {
    href: "/admin/menu-items",
    label: "Menu Items",
    icon: "🍽️",
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: "📦",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed left-4 top-16 z-40 bg-primary text-black p-2 rounded-full shadow-md"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? "✕" : "☰"}
      </button>

      <aside
        className={`${
          isMobile
            ? isMobileOpen
              ? "fixed inset-0 z-30 bg-black bg-opacity-50"
              : "hidden"
            : "block"
        } md:block`}
        onClick={(e) => {
          if (isMobile && e.target === e.currentTarget) {
            setIsMobileOpen(false);
          }
        }}
      >
        <div
          className={`
            bg-white border-r min-h-[calc(100vh-4rem)] 
            ${isMobile ? "w-64 h-full shadow-lg" : "w-64"}
            ${isMobile && !isMobileOpen ? "transform -translate-x-full" : ""} 
            transition-transform duration-300 ease-in-out
            md:transform-none
          `}
        >
          <nav className="p-4 space-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-black"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
