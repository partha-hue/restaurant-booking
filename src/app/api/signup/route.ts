import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const { name, email, password, admin } = await request.json();
    const wantsAdminAccess = Boolean(admin);
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const adminEmails = getAdminEmails();
    const approvedAdminCount = await db.collection("admin_access").countDocuments({ status: "approved" });
    const shouldBootstrapApprove = approvedAdminCount === 0;
    const canGrantAdminAccess = adminEmails.includes(normalizedEmail) || shouldBootstrapApprove;

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: normalizedEmail });
    if (existingUser) {
      if (!wantsAdminAccess) {
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }

      const passwordMatches = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatches) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      if (!canGrantAdminAccess) {
        return NextResponse.json({ error: "Admin signup is restricted to the configured admin email or the first bootstrap admin." }, { status: 403 });
      }

      await db.collection("admin_access").updateOne(
        { email: normalizedEmail },
        {
          $set: {
            name: existingUser.name || name,
            email: normalizedEmail,
            company: "",
            status: "approved",
            approvedAt: new Date(),
            approvedBy: shouldBootstrapApprove ? "bootstrap" : "signup",
          },
        },
        { upsert: true }
      );

      const token = jwt.sign(
        { userId: existingUser._id, email: normalizedEmail },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        success: true,
        message: "Admin account ready. You can log in now.",
        token,
        user: { id: existingUser._id, name: existingUser.name || name, email: normalizedEmail },
        admin: true,
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      });

      return response;
    }

    if (wantsAdminAccess && !canGrantAdminAccess) {
      return NextResponse.json({ error: "Admin signup is restricted to the configured admin email or the first bootstrap admin." }, { status: 403 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.collection("users").insertOne({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    if (wantsAdminAccess || canGrantAdminAccess) {
      await db.collection("admin_access").updateOne(
        { email: normalizedEmail },
        {
          $set: {
            name,
            email: normalizedEmail,
            company: "",
            status: "approved",
            approvedAt: new Date(),
            approvedBy: shouldBootstrapApprove ? "bootstrap" : "signup",
          },
        },
        { upsert: true }
      );
    }

    // Create JWT token for immediate access
    const token = jwt.sign(
      { userId: result.insertedId, email: normalizedEmail },
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
        to: normalizedEmail,
        subject: "Welcome to FoodHub! 🍽️",
        text: `Hi ${name || normalizedEmail},

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
      user: { id: result.insertedId, name, email: normalizedEmail },
      admin: wantsAdminAccess || canGrantAdminAccess,
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
