import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/user";
import dbConnect from "@/lib/dbconection";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).select("-password");
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const data = await req.json();
  await dbConnect();
  const updated = await User.findOneAndUpdate({ email: session.user.email }, data, { new: true });
  return NextResponse.json(updated);
}
