"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, User, Menu, X } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/foodhub-logo.svg" alt="Food Hub Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-primary dark:text-yellow-400">FoodHub</span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 text-lg font-medium">
            <li>
              <Link
                className="hover:underline transition-colors duration-200"
                href="/restaurants"
              >
                Explore
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline transition-colors duration-200"
                href="/bookings"
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline transition-colors duration-200"
                href="/userprofile"
              >
                Profile
              </Link>
            </li>
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme Switch */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all hover:bg-white/20"
            >
              <Sun
                className={`absolute h-5 w-5 transition-all ${
                  theme === "dark" ? "scale-0 rotate-90" : "scale-100 rotate-0"
                }`}
              />
              <Moon
                className={`absolute h-5 w-5 transition-all ${
                  theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
                }`}
              />
            </button>

            {/* Cart */}
            <button
              className="relative w-10 h-10 flex items-center justify-center border border-white/30 rounded-full hover:bg-white/20 transition-all"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                8
              </span>
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center border border-white/30 rounded-full hover:bg-white/20 transition-all"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <span className="text-xl font-bold text-primary dark:text-yellow-400">FoodHub</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-col p-4 gap-3">
          <li>
            <Link href="/restaurants" className="btn btn-ghost w-full justify-start" onClick={() => setSidebarOpen(false)}>Explore</Link>
          </li>
          <li>
            <Link href="/bookings" className="btn btn-ghost w-full justify-start" onClick={() => setSidebarOpen(false)}>Bookings</Link>
          </li>
          <li>
            <Link href="/profile" className="btn btn-ghost w-full justify-start" onClick={() => setSidebarOpen(false)}>Profile</Link>
          </li>
          <li>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="btn btn-outline w-full justify-start"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </li>
        </ul>
      </aside>

      {/* Spacer for fixed Navbar */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 mt-16">
        <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">Welcome to Food Hub</h1>
        <p className="text-lg max-w-2xl mb-8 animate-fade-in-delay">
          Discover, book, and enjoy the best restaurants in your city. Explore menus, check reviews, and reserve your table with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/restaurants" className="btn btn-primary btn-lg px-8 py-3">
            Explore Restaurants
          </Link>
          <Link href="/admin" className="btn btn-outline btn-lg px-8 py-3">
            Signup as Admin
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 w-full bg-white dark:bg-gray-900 rounded-t-lg shadow text-center text-gray-700 dark:text-gray-200 text-sm">
        <div className="mb-2 font-bold text-xl text-primary dark:text-yellow-400">Food Hub &copy; 2025</div>
        <div className="mb-2">Discover and book the best restaurants. Made with <span className="text-red-500">❤️</span>.</div>
        <div className="mb-2 flex justify-center gap-4">
          <Link href="/restaurants" className="hover:underline text-blue-700 dark:text-blue-400 font-semibold">Restaurants</Link>
          <Link href="/bookings" className="hover:underline text-blue-700 dark:text-blue-400 font-semibold">Bookings</Link>
          <Link href="/userprofile" className="hover:underline text-blue-700 dark:text-blue-400 font-semibold">Profile</Link>
        </div>
        <div className="max-w-xl mx-auto text-xs mt-2">
          Food Hub is your one-stop platform to discover, explore, and book the best restaurants in your city.
        </div>
      </footer>

      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-in;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1.5s ease-in;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
