import { connectToDatabase } from "../lib/mongodb/connection";
import { Category } from "../lib/models/category.model";

export async function findCategoryByIdAndUserId(categoryId: string, userId: string) {
    await connectToDatabase();

    return Category.findOne({
        _id: categoryId,
        userId,
    })
}

export async function findCategoriesByUserId(userId: string) {
    await connectToDatabase();

    return Category.find({ userId })
        .select({ _id: 1, name: 1, type: 1 })
        .sort({ name: 1 });
}