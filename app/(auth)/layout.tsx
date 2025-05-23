import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-primary"
        >
          🐼 Hungry Panda
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}
