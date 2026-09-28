import { connectToDatabase } from "../lib/mongodb/connection";
import { Category } from "../lib/models/category.model";

export async function findCategoryByIdAndUserId(categoryId: string, userId: string) {
    await connectToDatabase();

    return Category.findOne({
        _id: categoryId,
        userId,
    })
}