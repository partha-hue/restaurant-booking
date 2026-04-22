import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

function getAdminEmails() {
        const raw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
        return raw
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
}

export async function POST(request: NextRequest) {
        try {
                const { name, email, company, reason } = await request.json();

                if (!name || !email || !reason) {
                        return NextResponse.json({ error: "Name, email, and reason are required" }, { status: 400 });
                }

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                const requestDoc = {
                        name: String(name).trim(),
                        email: String(email).trim().toLowerCase(),
                        company: String(company || "").trim(),
                        reason: String(reason).trim(),
                        status: "pending",
                        createdAt: new Date(),
                };

                const existing = await db.collection("admin_requests").findOne({ email: requestDoc.email, status: "pending" });
                if (existing) {
                        return NextResponse.json({ error: "You already have a pending admin access request" }, { status: 409 });
                }

                const result = await db.collection("admin_requests").insertOne(requestDoc);

                const adminEmails = getAdminEmails();
                if (adminEmails.length > 0 && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                        try {
                                const transporter = nodemailer.createTransport({
                                        service: "gmail",
                                        auth: {
                                                user: process.env.EMAIL_USER,
                                                pass: process.env.EMAIL_PASS,
                                        },
                                });

                                await transporter.sendMail({
                                        from: process.env.EMAIL_USER,
                                        to: adminEmails.join(","),
                                        subject: "New FoodHub admin access request",
                                        text: `Admin access request from ${requestDoc.name} (${requestDoc.email}).\n\nCompany: ${requestDoc.company || "N/A"}\n\nReason:\n${requestDoc.reason}`,
                                });
                        } catch (mailError) {
                                console.error("Admin request notification email error:", mailError);
                        }
                }

                return NextResponse.json({
                        success: true,
                        requestId: result.insertedId,
                        message: "Admin access request submitted successfully",
                });
        } catch (error) {
                console.error("Admin request error:", error);
                return NextResponse.json({ error: "Failed to submit admin access request" }, { status: 500 });
        }
}
