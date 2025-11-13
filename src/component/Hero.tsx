"use client";
import { useRouter } from "next/navigation";
import React from "react";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div
      className="
        relative h-screen overflow-hidden flex items-center justify-center 
        bg-gradient-to-br from-yellow-50 via-purple-50 to-blue-50 
        dark:from-gray-900 dark:via-gray-800 dark:to-black
        transition-colors duration-700
      "
    >
      {/* Layered Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="
            absolute w-full h-full bg-cover bg-center rounded-3xl shadow-xl animate-fadeIn
          "
          style={{
            backgroundImage: "url('/layer1.jpg')",
            filter: "blur(2px) brightness(0.95)",
          }}
        />
        <div
          className="
            absolute w-full h-full bg-cover bg-center rounded-3xl shadow-lg animate-fadeIn delay-150
          "
          style={{
            backgroundImage: "url('/layer2.jpg')",
            opacity: 0.6,
            filter: "blur(4px) brightness(0.9)",
          }}
        />
        <div
          className="
            absolute w-full h-full bg-cover bg-center rounded-3xl shadow-md animate-fadeIn delay-300
          "
          style={{
            backgroundImage: "url('/layer3.jpg')",
            opacity: 0.4,
            filter: "blur(6px) brightness(0.85)",
          }}
        />
      </div>

      {/* Overlay */}
      <div
        className="
          absolute inset-0 rounded-3xl z-10 
          bg-gradient-to-br from-white/70 via-white/30 to-white/10
          dark:from-black/70 dark:via-gray-900/60 dark:to-black/80
          backdrop-blur-sm
          transition-all duration-500
        "
      ></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-3xl mx-auto animate-fadeIn">
        <h1
          className="
            text-5xl font-extrabold mb-4 drop-shadow-2xl animate-textPop
            text-gray-900 dark:text-white
          "
        >
          Discover, book, and enjoy the best restaurants in your city!
        </h1>

        <h2
          className="
            mt-2 text-lg mb-6 animate-slideUp leading-relaxed
            text-gray-700 dark:text-gray-300
          "
        >
          Food Hub helps you explore, discover, and book top restaurants easily.
          <br />
          Experience the joy of delicious dining with just a click.
          <br />
          <span className="font-semibold text-purple-700 dark:text-yellow-300">
            Join us and enjoy every bite!
          </span>
        </h2>

        <button
          onClick={() => router.push("/home")}
          className="
            mt-4 px-8 py-3 text-lg font-bold shadow-xl rounded-full 
            hover:scale-105 transition-transform duration-300 
            focus:outline-none focus:ring-2 focus:ring-purple-400 animate-bounceIn
            bg-purple-600 hover:bg-purple-700 text-white
            dark:bg-purple-500 dark:hover:bg-purple-400 dark:text-black
          "
        >
          Get Started
        </button>

        <div
          className="
            mt-6 text-sm text-gray-700 dark:text-gray-400 
            transition-colors duration-300
          "
        >
          No account needed to browse. Sign up for booking and exclusive offers!
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
