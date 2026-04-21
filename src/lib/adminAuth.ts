import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

export async function requireAdminSession() {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email || !isAdminEmail(session.user.email)) {
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
