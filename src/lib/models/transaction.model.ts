import mongoose, { Schema } from "mongoose";

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Schema.Types.Decimal128,
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
    },
    categoryId: {
        type: Schema.Types.ObjectId, 
        ref: "Category",
        required: true
    },
    description: {
        type: String,
        default: null,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
},
{
    timestamps: true
}
);

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);