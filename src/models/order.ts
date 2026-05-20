import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        meta: { type: Object, required: false },
});

const OrderSchema = new mongoose.Schema({
        items: [OrderItemSchema],
        total: { type: Number, required: true },
        userId: { type: String },
        status: { type: String, default: 'pending' },
        createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
