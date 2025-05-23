import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hungry Panda - Food Delivery",
  description: "Order delicious food online with Hungry Panda",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
