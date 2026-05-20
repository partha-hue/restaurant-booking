import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        meta: { type: Object, required: false },
});

const CartSchema = new mongoose.Schema({
        userId: { type: String, required: true, unique: true },
        items: [CartItemSchema],
        updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
