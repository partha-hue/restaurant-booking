import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
        token.name = profile?.name ?? token.name;
        token.email = profile?.email ?? token.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          name: token.name,
          email: token.email,
        };
        session.provider = token.provider;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },

  // ✅ Email notifications for both login and first-time signup
  events: {
    async signIn({ user, account, isNewUser }) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        if (isNewUser) {
          // 🎉 Send welcome email for first-time signup
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email!,
            subject: "🎉 Welcome to FoodHub!",
            text: `Hi ${user.name || user.email},

Welcome to FoodHub! Your ${account?.provider} account has been successfully connected.

Start exploring restaurants and exclusive offers now.

– The FoodHub Team`,
          });
          console.log(`✅ Signup email sent to ${user.email}`);
        } else {
          // ✉️ Send login notification for returning user
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email!,
            subject: `Login Notification - ${account?.provider?.toUpperCase()} Login`,
            text: `Hi ${user.name || user.email},

You have successfully logged in to FoodHub using your ${account?.provider} account.

If this wasn’t you, please reset your password immediately.

– The FoodHub Security Team`,
          });
          console.log(`✅ Login email sent to ${user.email}`);
        }
      } catch (error) {
        console.error("⚠️ Email send error:", error);
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
