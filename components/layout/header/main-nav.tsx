"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // Navigation links
  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/restaurants", label: "Restaurants", icon: "🍽️" },
  ];

  // Add cart link if authenticated
  if (isAuthenticated) {
    links.push({ href: "/cart", label: "Cart", icon: "🛒" });
  }

  return (
    <nav className="hidden md:flex space-x-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              isActive ? "text-primary font-semibold" : "text-gray-700"
            }`}
          >
            <span className="mr-1.5">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
