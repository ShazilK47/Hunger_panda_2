import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CartProvider>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </CartProvider>
    </div>
  );
}
