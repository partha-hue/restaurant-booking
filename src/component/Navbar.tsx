"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Offer {
  id: string;
  restaurantId: string;
  restaurantName: string;
  offerTitle: string;
  offerDescription: string;
  offerImage: string;
  validUntil: string;
}

export default function SpecialOffersCarousel() {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideVisible = 2; // number of cards visible at a time

  // Fetch offers
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();
        if (Array.isArray(data)) setOffers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, offers]);

  const handleBookNow = (restaurantId: string) => {
    router.push(`/book/${restaurantId}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + slideVisible >= offers.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? Math.max(offers.length - slideVisible, 0) : prev - 1
    );
  };

  if (loading) {
    return <p className="text-center text-gray-700 dark:text-gray-300">Loading offers...</p>;
  }

  if (offers.length === 0) {
    return <p className="text-center text-gray-700 dark:text-gray-300">No special offers available now.</p>;
  }

  return (
    <section className="relative w-full p-6 bg-gradient-to-br from-yellow-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl transition-colors duration-300 mt-10">
      <h2 className="text-3xl font-bold text-center text-purple-900 dark:text-purple-300 mb-6">
        Special Offers 🎉
      </h2>

      <div className="relative overflow-hidden">
        {/* Carousel Frame */}
        <motion.div
          className="flex"
          style={{
            width: `${offers.length * 50}%`, // 2 cards visible -> each 50% of frame
          }}
          animate={{ x: `-${(currentIndex * 100) / offers.length}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="w-1/2 px-2" // 2 cards visible
            >
              <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer hover:scale-105 transition-transform">
                <img
                  src={offer.offerImage}
                  alt={offer.offerTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300">
                    {offer.offerTitle}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {offer.offerDescription}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                    Valid until: {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                  <button
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                    onClick={() => handleBookNow(offer.restaurantId)}
                  >
                    Book Now at {offer.restaurantName}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition z-10"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
