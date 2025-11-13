import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodhub";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: "foodhub",
  });
}

// Define schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    return NextResponse.json({ success: true, message: "Message saved successfully!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
