import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/foodhub";

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    dbName: "foodhub",
  });
}

// Review Schema
const ReviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export async function GET() {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, rating, message } = await req.json();

    if (!name || !rating || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const review = new Review({ name, rating, message });
    await review.save();

    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
