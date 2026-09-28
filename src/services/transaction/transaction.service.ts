import { AppError } from "@/src/lib/errors/app-error";
import { findCategoryByIdAndUserId } from "@/src/repositories/category.repository";
import { createTransaction } from "@/src/repositories/transaction.repository";
import type { CreateTransactionInput } from "@/src/types/transaction";

export async function createTransactionService(userId: string, data: CreateTransactionInput) {
    if (!userId) {
        throw new AppError(
            "SESSION_INVALID",
            "User is not authenticated.",
            401
        );
    }

    // categoría existe categoría pertenece al usuario 
    const category = await findCategoryByIdAndUserId(data.categoryId, userId);
        
    if (!category) {
        throw new AppError(
            "CATEGORY_NOT_FOUND",
            "Category not found.",
            404
        )
    }

    // transaction.type === category.type
    if (data.type !== category.type) {
        throw new AppError(
            "TRANSACTION_TYPE_MISMATCH",
            "Transaction type doesn't match category type.",
            400
        )
    }

    // amount > 0
    if(data.amount <= 0) {
        throw new AppError(
            "INVALID_AMOUNT",
            "Amount must be greater than 0",
            400
        )
    }

    // fecha no futura
    if(data.date > new Date()) {
        throw new AppError(
            "INVALID_DATE",
            "Date cannot be in the future.",
            400
        )
    }
        
    return createTransaction({...data, userId});
}