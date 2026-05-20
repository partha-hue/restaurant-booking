import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/user";
import dbConnect from "@/lib/dbconection";
import bcrypt from "bcryptjs";

function toSafeProfile(user: any) {
  if (!user) return null;
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    phone: user.phone,
    address: user.address,
    twoFactorEnabled: Boolean(user.twoFactorEnabled),
    createdAt: user.createdAt,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions as any);
  const s = session as any;
  if (!s?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: s.user.email }).select("-password");
  return NextResponse.json(toSafeProfile(user));
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions as any);
  const s = session as any;
  if (!s?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  await dbConnect();
  const allowed: Record<string, any> = {};
  if (typeof data.name === "string") allowed.name = data.name.trim();
  if (typeof data.image === "string") allowed.image = data.image.trim();
  if (typeof data.phone === "string") allowed.phone = data.phone.trim();
  if (typeof data.address === "string") allowed.address = data.address.trim();
  if (typeof data.twoFactorEnabled === "boolean") allowed.twoFactorEnabled = data.twoFactorEnabled;

  const updated = await User.findOneAndUpdate(
    { email: s.user.email },
    { $set: allowed },
    { new: true }
  ).select("-password");

  return NextResponse.json(toSafeProfile(updated));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);
  const s = session as any;
  if (!s?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { currentPassword, newPassword } = body || {};
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
  }
  if (String(newPassword).length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findOne({ email: s.user.email });
  if (!user?.password) {
    return NextResponse.json({ error: "Password login is not available for this account" }, { status: 400 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return NextResponse.json({ success: true });
}
