"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Promotion {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  linkText: string;
  backgroundColor: string;
}

export default function PromotionBanner() {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // In a real app, this would be fetched from an API
    // Simulating API call with setTimeout
    const fetchPromotion = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock promotion data
      const activePromotion: Promotion = {
        id: "promo-1",
        title: "Spring Special Offers!",
        description: "Get 20% off on your first order with code SPRING25",
        linkUrl: "/promotions/spring2025",
        linkText: "Learn More",
        backgroundColor: "bg-gradient-to-r from-primary/20 to-accent/20",
      };

      setPromotion(activePromotion);
    };

    fetchPromotion();
  }, []);

  if (!visible || !promotion) return null;

  return (
    <div className={`py-3 ${promotion.backgroundColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center">
            <p className="font-medium mr-2">{promotion.title}</p>
            <p className="text-sm text-gray-600">{promotion.description}</p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Link
              href={promotion.linkUrl}
              className="text-primary text-sm font-medium hover:underline mr-4"
            >
              {promotion.linkText}
            </Link>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
