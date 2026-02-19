import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/component/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Hub",
  description: "Discover and book the best restaurants in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased transition-colors duration-500 bg-white text-black dark:bg-gray-900 dark:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
