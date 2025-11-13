import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { signJwt } from "@/lib/jwt";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
      const { email, otp } = await req.json();
      if (!email || !otp) return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

      await client.connect();
      const db = client.db();
      const record = await db.collection("otp_codes").findOne({ email });
      if (!record || record.otp !== otp || Date.now() > record.expires) {
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
      }

      // Find or create user

      let user = await db.collection("users").findOne({ email });
      if (!user) {
            const insertResult = await db.collection("users").insertOne({ email, createdAt: new Date() });
            user = await db.collection("users").findOne({ _id: insertResult.insertedId });
      }

      // Remove OTP after use
      await db.collection("otp_codes").deleteOne({ email });

      // Issue JWT (or set session cookie)
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 500 });
      const token = await signJwt({ email: user.email, _id: user._id });
      const res = NextResponse.json({ success: true });
      res.cookies.set("jwt", token, { httpOnly: true, path: "/" });
      return res;
}
