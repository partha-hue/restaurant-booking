export function isAdminEmail(email?: string | null): boolean {
      if (!email) return false;
      const normalizedEmail = email.trim().toLowerCase();
      const rawEmails = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
      const allowed = rawEmails
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
      return allowed.includes(normalizedEmail);
}
