import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Manager', 'Inventory Manager', 'Order Manager', 'Viewer'],
        default: 'Manager'
    },
    addedBy: { type: String, default: 'Primary Admin' },
    createdAt: { type: Number, default: Date.now }
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;