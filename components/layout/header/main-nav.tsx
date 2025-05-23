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
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
  ];

  // Add cart link if authenticated
  if (isAuthenticated) {
    links.push({ href: "/cart", label: "Cart" });
  }

  return (
    <nav className="hidden md:flex space-x-8">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive ? "text-primary" : "text-gray-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
