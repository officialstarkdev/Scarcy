import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    value: { type: Number, required: true, min: 1 },
    minOrder: { type: Number, default: 0 },      // subtotal must reach this
    maxDiscount: { type: Number, default: 0 },   // cap for percent codes (0 = no cap)
    usageLimit: { type: Number, default: 0 },    // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Returns { discount } or throws a friendly error
promoSchema.methods.priceFor = function (subtotal) {
  if (!this.isActive) throw new Error('This promo code is no longer active');
  if (this.expiresAt && this.expiresAt < new Date()) throw new Error('This promo code has expired');
  if (this.usageLimit > 0 && this.usedCount >= this.usageLimit) throw new Error('This promo code has been fully redeemed');
  if (subtotal < this.minOrder) throw new Error(`This code needs a minimum order of Rs ${this.minOrder.toLocaleString()}`);

  let discount = this.type === 'percent' ? (subtotal * this.value) / 100 : this.value;
  if (this.type === 'percent' && this.maxDiscount > 0) discount = Math.min(discount, this.maxDiscount);
  discount = Math.min(Math.round(discount), subtotal);
  return discount;
};

export default mongoose.model('PromoCode', promoSchema);
