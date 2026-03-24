import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Twilio from 'twilio';
import Booking from "@/models/booking";

export async function GET() {
      try {
            await clientPromise; // Ensure DB connection
            const bookings = await Booking.find({}).sort({ createdAt: -1 });
            return NextResponse.json(bookings);
      } catch (error) {
            console.error('GET bookings error:', error);
            return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
      }
}

export async function POST(request: Request) {
      try {
            await clientPromise;
            const body = await request.json();

            // Create booking using Mongoose model
            const booking = new Booking({
                  restaurantId: body.restaurantId,
                  restaurantName: body.restaurantName,
                  name: body.name,
                  phone: body.phone,
                  date: body.date,
                  guests: body.guests,
                  payment: body.payment,
            });

            const savedBooking = await booking.save();

            // Send SMS confirmation if phone is provided
            if (body.phone && process.env.TWILIO_ACCOUNT_SID) {
                  try {
                        const twilioClient = Twilio(
                              process.env.TWILIO_ACCOUNT_SID!,
                              process.env.TWILIO_AUTH_TOKEN!
                        );
                        await twilioClient.messages.create({
                              body: `Your booking at ${body.restaurantName} is confirmed for ${body.date}. Thank you, ${body.name}!`,
                              from: process.env.TWILIO_PHONE_NUMBER!,
                              to: body.phone,
                        });
                  } catch (smsErr) {
                        console.error('Twilio SMS error:', smsErr);
                  }
            }

            return NextResponse.json({ success: true, id: savedBooking._id });
      } catch (error) {
            console.error('POST booking error:', error);
            return NextResponse.json({ error: "Failed to book restaurant" }, { status: 500 });
      }
}

export async function DELETE(request: Request) {
      try {
            await clientPromise;
            const { ids } = await request.json();

            if (!Array.isArray(ids) || ids.length === 0) {
                  return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
            }

            await Booking.deleteMany({ _id: { $in: ids } });

            return NextResponse.json({ success: true, deletedCount: ids.length });
      } catch (error) {
            console.error('DELETE bookings error:', error);
            return NextResponse.json({ error: "Failed to delete bookings" }, { status: 500 });
      }
}
