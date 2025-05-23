import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
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
                <Link href="/login" className="text-gray-400 hover:text-white">
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
          <p>© {currentYear} Hungry Panda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
