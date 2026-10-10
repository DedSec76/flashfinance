import mongoose from "mongoose";

import { connectToDatabase } from "../lib/mongodb/connection";
import { Category } from "../lib/models/category.model";

export async function findCategoryByIdAndUserId(categoryId: string, userId: string) {
    await connectToDatabase();

    return Category.findOne({
        _id: new mongoose.Types.ObjectId(categoryId),
        userId: new mongoose.Types.ObjectId(userId),
    });
}

export async function findCategoriesByUserId(userId: string) {
    await connectToDatabase();

    return Category.find({ userId: new mongoose.Types.ObjectId(userId) })
        .select({ _id: 1, name: 1, normalizedName: 1, type: 1 })
        .sort({ name: 1 });
}

export async function findCategoryByNormalizedName(userId: string, normalizedName: string) {
    await connectToDatabase();

    return Category.findOne({ userId: new mongoose.Types.ObjectId(userId), normalizedName });
}

export async function createCategory(data: {
    name: string;
    normalizedName: string;
    type: "income" | "expense";
    userId: string;
}) {
    await connectToDatabase();

    return Category.create({
        ...data,
        userId: new mongoose.Types.ObjectId(data.userId),
    });
}

export async function updateCategory(
    categoryId: string,
    userId: string,
    data: {
        name: string;
        normalizedName: string;
        type: "income" | "expense";
    },
) {
    await connectToDatabase();

    return Category.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(categoryId), userId: new mongoose.Types.ObjectId(userId) },
        { $set: data },
        { new: true, runValidators: true },
    );
}

export async function deleteCategory(categoryId: string, userId: string) {
    await connectToDatabase();

    return Category.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(categoryId),
        userId: new mongoose.Types.ObjectId(userId),
    });
}