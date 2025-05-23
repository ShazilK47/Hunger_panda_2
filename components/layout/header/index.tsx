import Link from "next/link";
import UserNav from "./user-nav";
import MainNav from "./main-nav";
import { CartButton } from "@/components/cart/cart-button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary mr-8">
              🐼 Hungry Panda
            </Link>
            <MainNav />
          </div>
          <div className="flex items-center space-x-4">
            <CartButton />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
