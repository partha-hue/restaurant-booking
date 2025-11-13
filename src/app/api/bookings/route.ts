export async function GET() {
      try {
            const client = await clientPromise;
            const db = client.db();
            const bookings = await db.collection("bookings").find({}).toArray();
            return NextResponse.json(bookings);
      } catch (error) {
            return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
      }
}

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Twilio from 'twilio';

export async function POST(request: Request) {
      try {
            const body = await request.json();
            const client = await clientPromise;
            const db = client.db();
            const result = await db.collection("bookings").insertOne({
                  restaurantId: body.restaurantId,
                  name: body.name,
                  date: body.date,
                  phone: body.phone,
                  createdAt: new Date(),
            });

            // Send SMS confirmation if phone is provided
            if (body.phone) {
                  try {
                        const twilioClient = Twilio(
                              process.env.TWILIO_ACCOUNT_SID!,
                              process.env.TWILIO_AUTH_TOKEN!
                        );
                        await twilioClient.messages.create({
                              body: `Your booking at FoodHub is confirmed for ${body.date}. Thank you, ${body.name}!`,
                              from: process.env.TWILIO_PHONE_NUMBER!,
                              to: body.phone,
                        });
                  } catch (smsErr) {
                        console.error('Twilio SMS error:', smsErr);
                  }
            }

            return NextResponse.json({ success: true, id: result.insertedId });
      } catch (error) {
            return NextResponse.json({ error: "Failed to book restaurant" }, { status: 500 });
      }
}
