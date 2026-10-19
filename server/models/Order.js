import mongoose from 'mongoose';

export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        image: String,
        price: Number,
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    address: {
      street: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, default: 'Lahore' },
      phone: { type: String, required: true },
      note: { type: String, default: '' },
    },
    paymentMethod: { type: String, enum: ['cod', 'card'], default: 'cod' },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    stripeSessionId: String,
    promoCode: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    itemsPrice: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUSES },
        at: { type: Date, default: Date.now },
      },
    ],
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
