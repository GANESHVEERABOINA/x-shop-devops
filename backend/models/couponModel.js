import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    desc: { type: String, default: '' },
    active: { type: Boolean, default: true },
    used: { type: Number, default: 0 },
    limit: { type: Number, default: 100, min: 1 },
    createdAt: { type: Number, default: Date.now }
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;