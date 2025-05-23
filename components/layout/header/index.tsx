import Link from "next/link";
import UserNav from "./user-nav";
import MainNav from "./main-nav";

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
          <UserNav />
        </div>
      </div>
    </header>
  );
}
