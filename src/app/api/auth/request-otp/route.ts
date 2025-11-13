import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
      const { email } = await req.json();
      if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 min

      await client.connect();
      const db = client.db();
      await db.collection("otp_codes").updateOne(
            { email },
            { $set: { otp, expires } },
            { upsert: true }
      );

      // Send OTP email
      const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASS,
            },
      });
      try {
            await transporter.sendMail({
                  from: process.env.EMAIL_USER,
                  to: email,
                  subject: "Your FoodHub OTP Code",
                  text: `Your OTP code is: ${otp}`,
            });
      } catch (mailErr) {
            console.error('OTP email error:', mailErr);
            return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
}
