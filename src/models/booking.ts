import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
      restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
      },
      restaurantName: {
            type: String,
            required: true,
      },
      name: {
            type: String,
            required: true,
            trim: true,
      },
      phone: {
            type: String,
            required: true,
            trim: true,
      },
      date: {
            type: String,
            required: true,
      },
      guests: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
      },
      payment: {
            type: String,
            required: true,
            enum: ['offline', 'gpay', 'phonepe', 'paytm', 'bank'],
      },
      createdAt: {
            type: Date,
            default: Date.now,
      },
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);