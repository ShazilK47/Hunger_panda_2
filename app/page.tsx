import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            🐼 Hungry Panda
          </Link>
          <nav className="space-x-4">
            <Link
              href="/restaurants"
              className="text-gray-600 hover:text-primary"
            >
              Restaurants
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-primary">
              Login
            </Link>
            <Link href="/register" className="text-gray-600 hover:text-primary">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Delicious Food, Delivered Fast
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Order from your favorite restaurants and have delicious meals
              delivered right to your doorstep.
            </p>
            <Link
              href="/restaurants"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90 h-11 px-8 py-2"
            >
              Browse Restaurants
            </Link>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Browse Restaurants
                </h3>
                <p className="text-gray-600">
                  Find your favorite restaurants and discover new ones.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Your Food</h3>
                <p className="text-gray-600">
                  Select meals from the menu and add them to your cart.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Enjoy Your Delivery
                </h3>
                <p className="text-gray-600">
                  Track your order and enjoy your meal when it arrives.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              Popular Restaurants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* This will be replaced with real data later */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Restaurant Image
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Restaurant {i}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Delicious food and fast delivery. Great for students!
                    </p>
                    <Link
                      href={`/restaurants/${i}`}
                      className="text-primary hover:underline"
                    >
                      View Menu →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/restaurants"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                View All Restaurants
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h3 className="text-xl font-bold mb-4">🐼 Hungry Panda</h3>
              <p className="text-gray-400 max-w-md">
                The best food delivery service for university students.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/restaurants"
                    className="text-gray-400 hover:text-white"
                  >
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Hungry Panda. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
