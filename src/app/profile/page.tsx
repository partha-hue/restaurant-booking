// src/app/profile/page.tsx
import ProfileClient from "./ProfileClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        You must be logged in to view your profile.
      </div>
    );
  }

  // ✅ Convert null values to undefined for TypeScript
  const user = {
    name: session.user?.name ?? undefined,
    email: session.user?.email ?? undefined,
    image: session.user?.image ?? undefined,
  };

  return <ProfileClient user={user} />;
}
