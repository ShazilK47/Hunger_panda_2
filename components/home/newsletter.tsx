"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would send data to an API endpoint
      // await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setStatus("success");
      setMessage("Thank you for subscribing to our newsletter!");
      setEmail("");

      // Reset form after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    } catch (error: unknown) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <section className="py-12 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get special offers, new restaurant alerts, and delicious updates
            delivered to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="flex-grow">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-pill border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
              />
            </div>{" "}
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-black rounded-pill font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 shadow-sm hover:shadow-md"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "error" ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to our Privacy Policy and Terms of
            Service.
          </p>
        </div>
      </div>
    </section>
  );
}
