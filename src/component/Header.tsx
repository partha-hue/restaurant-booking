"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, ShoppingCart, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/foodhub-logo.svg" alt="Food Hub Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-2xl font-bold text-primary dark:text-yellow-400">
              FoodHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-4 text-lg font-medium">
            <li>
              <Link className="btn btn-ghost btn-sm hover:bg-gray-100 dark:hover:bg-gray-800" href="/home">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="btn btn-ghost btn-sm hover:bg-gray-100 dark:hover:bg-gray-800" href="/signup">
                Signup
              </Link>
            </li>
            <li>
              <Link className="btn btn-ghost btn-sm hover:bg-gray-100 dark:hover:bg-gray-800" href="/login">
                Login
              </Link>
            </li>
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme Switch */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative w-10 h-10 p-2">
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
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => router.push("/cart")}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                8
              </span>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full p-1">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/userprofile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/logout")}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Sidebar */}
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
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ul className="flex flex-col p-4 gap-3">
          <li>
            <Link className="btn btn-ghost w-full justify-start" href="/home" onClick={() => setSidebarOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link className="btn btn-ghost w-full justify-start" href="/signup" onClick={() => setSidebarOpen(false)}>
              Signup
            </Link>
          </li>
          <li>
            <Link className="btn btn-ghost w-full justify-start" href="/login" onClick={() => setSidebarOpen(false)}>
              Login
            </Link>
          </li>
          <li>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </li>
        </ul>
      </aside>
    </>
  );
}
