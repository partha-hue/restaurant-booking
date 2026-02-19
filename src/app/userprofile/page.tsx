import ProfileClient from "../profile/ProfileClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/userprofile");
  }

  // ✅ Convert null values to undefined for TypeScript
  const user = {
    id: session.user?.id,
    name: session.user?.name ?? undefined,
    email: session.user?.email ?? undefined,
    image: session.user?.image ?? undefined,
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <ProfileClient user={user} />
    </div>
  );
}
