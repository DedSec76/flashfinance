import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    normalizedName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true,
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

categorySchema.index(
    { userId: 1, normalizedName: 1 },
    { unique: true }
)

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);