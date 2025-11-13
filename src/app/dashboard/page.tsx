// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // If no session, redirect to login/signup
  if (!session) redirect("/signup");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
        Welcome, {session.user?.name || "User"} 👋
      </h1>
      <p className="mt-3 text-gray-700 dark:text-gray-300">
        You’re successfully logged in to your dashboard.
      </p>
    </div>
  );
}
