"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CustomerReview, getFeaturedReviews } from "@/lib/actions/reviews";
import SearchBar from "@/components/search/search-bar";

export default function HeroSection() {
  const [review, setReview] = useState<CustomerReview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReview = async () => {
      try {
        setLoading(true);
        const reviews = await getFeaturedReviews(1);
        if (reviews.length > 0) {
          setReview(reviews[0]);
        }
      } catch (error) {
        console.error("Error loading review:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, []);

  return (
    <section className="relative bg-secondary py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-textPrimary leading-tight slide-in-left">
              It&apos;s not just <span className="text-primary">Food</span>,{" "}
              <br />
              It&apos;s an <span className="text-primary">Experience</span>.
            </h1>
            <p
              className="text-lg md:text-xl text-textSecondary mb-8 max-w-lg slide-in-left"
              style={{ animationDelay: "0.1s" }}
            >
              Order from your favorite restaurants and have delicious meals
              delivered right to your doorstep.
            </p>

            {/* Search Component */}
            <div
              className="mb-8 slide-in-left"
              style={{ animationDelay: "0.2s" }}
            >
              <SearchBar />
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 mb-8 slide-in-left"
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/restaurants"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-pill text-base font-semibold transition-all bg-primary text-black hover:bg-primary/90 hover:shadow-md h-12 px-8 py-2 pulse-subtle"
              >
                View Menu
              </Link>
              <Link
                href="/restaurants"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-pill text-base font-semibold transition-all border-2 border-primary text-primary bg-white hover:bg-primary/5 h-12 px-8 py-2"
              >
                Learn More
              </Link>
            </div>

            {/* Customer Reviews */}
            <div
              className="bg-white rounded-lg p-4 shadow-card max-w-md slide-in-left"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-1 text-orange-500 mb-2">
                <span>?</span>
                <span>?</span>
                <span>?</span>
                <span>?</span>
                <span>?</span>
                <span className="ml-2 text-sm text-gray-600">
                  {loading ? "Loading..." : "4.9 (2.5k+ reviews)"}
                </span>
              </div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  &ldquo;
                  {review?.content ||
                    "The food delivery was prompt and the food was still hot when it arrived. Excellent service!"}
                  &rdquo;
                </p>
              )}
              <div className="flex items-center mt-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                </div>
                <span className="ml-3 text-xs text-gray-500">
                  {review?.customerName
                    ? `${review.customerName} and others`
                    : "and 1.2k+ satisfied customers"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-10 md:mt-0 relative slide-in-right">
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute w-80 h-80 bg-primary/10 rounded-full"></div>
              <div className="absolute inset-4 bg-primary/20 rounded-full"></div>
              <div className="absolute inset-8 bg-white rounded-full shadow-xl food-shadow overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3"
                    alt="Delicious Food"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 33vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-12 h-12 rounded-full bg-accent float-element opacity-80"></div>
            <div className="absolute bottom-10 left-10 w-8 h-8 rounded-full bg-red-500 float-element opacity-60"></div>
            <div className="absolute top-1/2 left-0 w-6 h-6 rounded-full bg-yellow-400 float-element delay-75 opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
