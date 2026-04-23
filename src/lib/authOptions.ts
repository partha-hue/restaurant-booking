import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import dbConnect from "./dbconection";
import nodemailer from "nodemailer";

const ADMIN_DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

async function hasAdminAccess(email?: string | null): Promise<boolean> {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const envEmails = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (envEmails.includes(normalizedEmail)) {
    return true;
  }

  const client = await clientPromise;
  const db = client.db(ADMIN_DATABASE_NAME);
  const approvedAdmin = await db.collection("admin_access").findOne({
    email: normalizedEmail,
    status: "approved",
  });

  return !!approvedAdmin;
}

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter email and password");
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = await hasAdminAccess(user.email);
      } else if (token.email) {
        token.isAdmin = await hasAdminAccess(token.email);
      }
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          isAdmin: token.isAdmin as boolean,
        };
        session.provider = token.provider as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      try {
        const client = await clientPromise;
        const db = client.db(ADMIN_DATABASE_NAME);
        await db.collection("users").updateOne(
          { email: user.email },
          { $set: { lastLogin: new Date() } },
          { upsert: false }
        );

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        if (isNewUser) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email!,
            subject: "🎉 Welcome to FoodHub!",
            text: `Hi ${user.name || user.email}, Welcome to FoodHub! Your account has been successfully created.`,
          });
        }
      } catch (error) {
        console.error("⚠️ Email send error:", error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "development-nextauth-secret",
};

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("Warning: NEXTAUTH_SECRET is not configured. Set it in .env for production.");
}
