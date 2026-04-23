import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAdminErrorStatus, requireAdminSession } from "@/lib/adminAuth";

const DATABASE_NAME = process.env.MONGODB_DB || "foodhub";

export async function GET() {
        try {
                const session = await requireAdminSession();
                const email = String(session.user?.email || "").toLowerCase();

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                const user = await db
                        .collection("users")
                        .findOne({ email }, { projection: { password: 0 } });

                const adminAccess = await db
                        .collection("admin_access")
                        .findOne({ email, status: "approved" });

                return NextResponse.json({
                        email,
                        name: user?.name || session.user?.name || "",
                        phone: user?.phone || "",
                        address: user?.address || "",
                        image: user?.image || "",
                        isActive: user?.isActive !== false,
                        createdAt: user?.createdAt || null,
                        lastLogin: user?.lastLogin || null,
                        company: adminAccess?.company || "",
                        approvedAt: adminAccess?.approvedAt || null,
                        approvedBy: adminAccess?.approvedBy || null,
                });
        } catch (error) {
                return NextResponse.json(
                        { error: "Failed to fetch admin profile" },
                        { status: getAdminErrorStatus(error) }
                );
        }
}

export async function PUT(request: Request) {
        try {
                const session = await requireAdminSession();
                const email = String(session.user?.email || "").toLowerCase();
                const body = await request.json();

                const nextName = typeof body?.name === "string" ? body.name.trim() : undefined;
                const nextPhone = typeof body?.phone === "string" ? body.phone.trim() : undefined;
                const nextAddress = typeof body?.address === "string" ? body.address.trim() : undefined;
                const nextImage = typeof body?.image === "string" ? body.image.trim() : undefined;
                const nextCompany = typeof body?.company === "string" ? body.company.trim() : undefined;

                const userUpdate: Record<string, unknown> = { updatedAt: new Date() };
                if (nextName !== undefined) userUpdate.name = nextName;
                if (nextPhone !== undefined) userUpdate.phone = nextPhone;
                if (nextAddress !== undefined) userUpdate.address = nextAddress;
                if (nextImage !== undefined) userUpdate.image = nextImage;

                const client = await clientPromise;
                const db = client.db(DATABASE_NAME);

                await db.collection("users").updateOne(
                        { email },
                        { $set: userUpdate },
                        { upsert: false }
                );

                if (nextCompany !== undefined || nextName !== undefined) {
                        await db.collection("admin_access").updateOne(
                                { email, status: "approved" },
                                {
                                        $set: {
                                                ...(nextCompany !== undefined ? { company: nextCompany } : {}),
                                                ...(nextName !== undefined ? { name: nextName } : {}),
                                                updatedAt: new Date(),
                                        },
                                },
                                { upsert: false }
                        );
                }

                const user = await db
                        .collection("users")
                        .findOne({ email }, { projection: { password: 0 } });

                const adminAccess = await db
                        .collection("admin_access")
                        .findOne({ email, status: "approved" });

                return NextResponse.json({
                        success: true,
                        profile: {
                                email,
                                name: user?.name || "",
                                phone: user?.phone || "",
                                address: user?.address || "",
                                image: user?.image || "",
                                company: adminAccess?.company || "",
                        },
                });
        } catch (error) {
                return NextResponse.json(
                        { error: "Failed to update admin profile" },
                        { status: getAdminErrorStatus(error) }
                );
        }
}
