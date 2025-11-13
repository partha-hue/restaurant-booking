import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Create JWT token for immediate access
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Send confirmation email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"FoodHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to FoodHub! 🍽️",
        text: `Hi ${name || email},

Your signup was successful. You can now log in to FoodHub.

Thank you for joining us!
`,
      });
    } catch (mailErr) {
      console.error("Signup email error:", mailErr);
    }

    // Return success + token so frontend can auto-login
    const response = NextResponse.json({
      success: true,
      message: "Signup successful! Welcome to FoodHub.",
      token,
      user: { id: result.insertedId, name, email },
    });

    // Optionally, set JWT cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to sign up" }, { status: 500 });
  }
}
