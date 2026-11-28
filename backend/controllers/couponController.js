import couponModel from "../models/couponModel.js";

// Admin: List all coupons
const listCoupons = async (_req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Create a new coupon
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, desc, limit } = req.body;
        const cleanCode = (code || '').trim().toUpperCase().replace(/\s+/g, '');

        if (!cleanCode) {
            return res.json({ success: false, message: "Coupon code is required" });
        }

        const val = Number(discountValue);
        if (!val || val <= 0) {
            return res.json({ success: false, message: "Enter a valid discount value" });
        }

        if (discountType === 'percent' && val > 90) {
            return res.json({ success: false, message: "Percentage discount cannot exceed 90%" });
        }

        const exists = await couponModel.findOne({ code: cleanCode });
        if (exists) {
            return res.json({ success: false, message: "This coupon code already exists" });
        }

        const newCoupon = new couponModel({
            code: cleanCode,
            discountType: discountType === 'flat' ? 'flat' : 'percent',
            discountValue: val,
            minOrderAmount: Math.max(0, Number(minOrderAmount) || 0),
            desc: (desc || '').trim() || (discountType === 'flat' ? `Flat ₹${val} off` : `${val}% off your order`),
            active: true,
            used: 0,
            limit: Math.max(1, Number(limit) || 100),
            createdAt: Date.now()
        });

        await newCoupon.save();
        res.json({ success: true, message: `Coupon ${cleanCode} created`, coupon: newCoupon });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Toggle coupon active/inactive
const toggleCoupon = async (req, res) => {
    try {
        const { id } = req.body;
        const coupon = await couponModel.findById(id);
        if (!coupon) {
            return res.json({ success: false, message: "Coupon not found" });
        }
        coupon.active = !coupon.active;
        await coupon.save();
        res.json({ success: true, message: coupon.active ? "Coupon activated" : "Coupon paused", coupon });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Admin: Delete coupon
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.body;
        await couponModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Customer Checkout: Validate & calculate coupon discount
const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        const cleanCode = (code || '').trim().toUpperCase();
        const orderSubtotal = Number(subtotal || 0);

        if (!cleanCode) {
            return res.json({ success: false, message: "Please enter a coupon code" });
        }

        const coupon = await couponModel.findOne({ code: cleanCode });
        if (!coupon) {
            return res.json({ success: false, message: "Invalid coupon code" });
        }

        if (!coupon.active) {
            return res.json({ success: false, message: "This coupon is currently inactive" });
        }

        if (coupon.used >= coupon.limit) {
            return res.json({ success: false, message: "Coupon usage limit reached" });
        }

        if (orderSubtotal < coupon.minOrderAmount) {
            return res.json({
                success: false,
                message: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon`
            });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
            discountAmount = Math.round((orderSubtotal * coupon.discountValue) / 100);
        } else {
            discountAmount = Math.min(orderSubtotal, coupon.discountValue);
        }

        res.json({
            success: true,
            message: `Coupon ${coupon.code} applied! You saved ₹${discountAmount}`,
            discountAmount,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                desc: coupon.desc
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { listCoupons, createCoupon, toggleCoupon, deleteCoupon, validateCoupon };