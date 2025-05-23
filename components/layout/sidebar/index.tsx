"use client";

import { useSession } from "next-auth/react";
import AdminSidebar from "./admin-sidebar";

export default function Sidebar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  // If it's an admin user, show the admin sidebar
  if (isAdmin) {
    return <AdminSidebar />;
  }

  // For regular users, we don't show a sidebar
  return null;
}
