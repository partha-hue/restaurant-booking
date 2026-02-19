"use client";

import { ThemeProvider } from "@/component/Themeprovider";
import { SessionProvider } from "next-auth/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <motion.div
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">
              Loading...
            </p>
          </div>
        )}
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
