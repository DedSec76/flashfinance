import { AppError } from "@/src/lib/errors/app-error";
import { findCategoryByIdAndUserId } from "@/src/repositories/category.repository";
import {
    createTransaction,
    deleteTransaction,
    findTransactionByIdAndUserId,
    findTransactionsByUserId,
    updateTransaction,
} from "@/src/repositories/transaction.repository";
import type {
    CreateTransactionInput,
    UpdateTransactionData,
} from "@/src/types/transaction";

function ensureAuthenticated(userId: string) {
    if (!userId) {
        throw new AppError(
            "SESSION_INVALID",
            "User is not authenticated.",
            401
        );
    }
}

function throwTransactionNotFound() {
    throw new AppError(
        "TRANSACTION_NOT_FOUND",
        "Transaction not found.",
        404
    );
}

export async function createTransactionService(userId: string, data: CreateTransactionInput) {
    ensureAuthenticated(userId);

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

export async function getTransactionsService(userId: string) {
    ensureAuthenticated(userId);

    return findTransactionsByUserId(userId);
}

export async function getTransactionByIdService(id: string, userId: string) {
    ensureAuthenticated(userId);

    const transaction = await findTransactionByIdAndUserId(id, userId);

    if (!transaction) {
        throwTransactionNotFound();
    }

    return transaction;
}

export async function updateTransactionService(
    id: string,
    userId: string,
    data: UpdateTransactionData
) {
    ensureAuthenticated(userId);

    const existingTransaction = await findTransactionByIdAndUserId(id, userId);

    if (!existingTransaction) {
        throwTransactionNotFound();
    }

    const amount = data.amount ?? Number(existingTransaction.amount.toString());
    if (amount <= 0) {
        throw new AppError(
            "INVALID_AMOUNT",
            "Amount must be greater than 0",
            400
        );
    }

    const date = data.date ?? existingTransaction.date;
    if (date > new Date()) {
        throw new AppError(
            "INVALID_DATE",
            "Date cannot be in the future.",
            400
        );
    }

    if (data.categoryId || data.type) {
        const categoryId = data.categoryId ?? existingTransaction.categoryId.toString();
        
        const category = await findCategoryByIdAndUserId(categoryId, userId);

        if (!category) {
            throw new AppError(
                "CATEGORY_NOT_FOUND",
                "Category not found.",
                404
            );
        }

        const type = data.type ?? existingTransaction.type;
        
        if (type !== category.type) {
            throw new AppError(
                "TRANSACTION_TYPE_MISMATCH",
                "Transaction type doesn't match category type.",
                400
            );
        }
    }

    const transaction = await updateTransaction(data, id, userId);

    if (!transaction) {
        throwTransactionNotFound();
    }

    return transaction;
}

export async function deleteTransactionService(id: string, userId: string) {
    ensureAuthenticated(userId);

    const transaction = await deleteTransaction(id, userId);

    if (!transaction) {
        throwTransactionNotFound();
    }

    return transaction;
}