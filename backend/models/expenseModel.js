import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    note: { type: String, default: '', trim: true },
    addedBy: { type: String, default: 'Admin' },
    date: { type: Number, default: Date.now }
});

const expenseModel = mongoose.models.expense || mongoose.model("expense", expenseSchema);

export default expenseModel;