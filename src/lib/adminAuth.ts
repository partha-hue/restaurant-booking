import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export function getAdminEmails(): string[] {
        const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
        return raw
                .split(",")
                .map((item) => item.trim().toLowerCase())
                .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
        if (!email) return false;
        return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function hasAdminAccess(email?: string | null): Promise<boolean> {
        if (!email) return false;

        const normalizedEmail = email.trim().toLowerCase();
        if (isAdminEmail(normalizedEmail)) {
                return true;
        }

        const client = await clientPromise;
        const db = client.db(DATABASE_NAME);
        const approvedAdmin = await db.collection("admin_access").findOne({
                email: normalizedEmail,
                status: "approved",
        });

        return Boolean(approvedAdmin);
}

export async function requireAdminSession() {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
                throw new Error("ADMIN_UNAUTHORIZED");
        }

        const hasAccess = Boolean(session.user.isAdmin) || await hasAdminAccess(session.user.email);
        if (!hasAccess) {
                throw new Error("ADMIN_UNAUTHORIZED");
        }

        return session;
}

export function getAdminErrorStatus(error: unknown): number {
        if (error instanceof Error && error.message === "ADMIN_UNAUTHORIZED") {
                return 403;
        }

        return 500;
}
