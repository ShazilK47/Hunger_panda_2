/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface MainNavProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function MainNav({ mobile = false, onNavigate }: MainNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  // Navigation links
  const links = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/restaurants", label: "Restaurants", icon: "🍽️" },
  ];

  return mobile ? (
    <nav className="flex flex-col gap-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center text-base font-medium rounded px-3 py-2 transition-colors hover:bg-primary/10 hover:text-primary ${
              isActive
                ? "text-primary bg-primary/10 font-semibold"
                : "text-gray-700"
            }`}
          >
            <span className="mr-2 text-lg">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  ) : (
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
