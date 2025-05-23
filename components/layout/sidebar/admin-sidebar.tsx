"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  {
    href: "/dashboard/admin/restaurants",
    label: "Restaurants",
    icon: "🏪",
  },
  {
    href: "/dashboard/admin/menu-items",
    label: "Menu Items",
    icon: "🍽️",
  },
  {
    href: "/dashboard/admin/orders",
    label: "Orders",
    icon: "📦",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
