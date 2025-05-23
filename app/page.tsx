import HeroSection from "@/components/home/hero-section";
import MenuShowcase from "@/components/home/menu-showcase";
import HowItWorks from "@/components/home/how-it-works";
import PopularRestaurants from "@/components/home/popular-restaurants";
import PromotionBanner from "@/components/home/promotion-banner";
import Newsletter from "@/components/home/newsletter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/cart/cart-context";

export default function Home() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <PromotionBanner />
          <HeroSection />
          <MenuShowcase />
          <HowItWorks />
          <PopularRestaurants />
          <Newsletter />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
