import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { CartProvider } from "@/components/cart/cart-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 relative">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto w-full">
            <div className="mx-auto container max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </CartProvider>
  );
}
