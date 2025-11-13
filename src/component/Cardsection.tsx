"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaUtensils, FaStar, FaClock, FaShieldAlt } from "react-icons/fa";

const WhyChooseSection = () => {
  const features = [
    {
      icon: <FaUtensils className="text-purple-600 dark:text-yellow-400 text-4xl mb-4" />,
      title: "Wide Restaurant Choices",
      desc: "Discover thousands of restaurants from local favorites to top-rated spots — all in one place.",
    },
    {
      icon: <FaStar className="text-purple-600 dark:text-yellow-400 text-4xl mb-4" />,
      title: "Verified Reviews & Ratings",
      desc: "We bring you authentic customer reviews to help you choose the perfect dining experience.",
    },
    {
      icon: <FaClock className="text-purple-600 dark:text-yellow-400 text-4xl mb-4" />,
      title: "Instant Booking",
      desc: "Reserve your table in just a few seconds. No waiting, no hassle — your spot is guaranteed.",
    },
    {
      icon: <FaShieldAlt className="text-purple-600 dark:text-yellow-400 text-4xl mb-4" />,
      title: "Secure Payments",
      desc: "Book confidently with secure UPI, card, and wallet payment options protected by encryption.",
    },
  ];

  return (
    <section
      className="
        py-20 px-6 md:px-12 lg:px-24 
        bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-black
        transition-colors duration-700
      "
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Why Choose <span className="text-purple-600 dark:text-yellow-400">Food Hub?</span>
        </h2>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          We make your dining experience smooth, enjoyable, and rewarding — from discovery to dining.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="
              bg-white dark:bg-gray-900/60 
              rounded-2xl shadow-lg p-6 text-center
              border border-gray-200 dark:border-gray-700
              hover:scale-105 transition-transform duration-300
            "
          >
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseSection;
