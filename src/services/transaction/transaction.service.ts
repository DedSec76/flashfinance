import { AppError } from "@/src/lib/errors/app-error";
import { findCategoryByIdAndUserId } from "@/src/repositories/category.repository";
import { createTransaction, deleteTransaction, findTransactionsByUserIdWithFilters, findTransactionByIdAndUserId, getMonthlyTransactionSummary, updateTransaction } from "@/src/repositories/transaction.repository";
import type { TransactionFilters, CreateTransactionInput, UpdateTransactionData } from "@/src/types/transaction";
import { transactionIdSchema } from "@/validations/transaction.validation";

function assertTransactionId(id: string) {
    const result = transactionIdSchema.safeParse(id);

    if (!result.success) {
        throw new AppError(
            "VALIDATION_ERROR",
            "Invalid transaction.",
            400
        );
    }
}

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

export async function getTransactionsService(userId: string, filters: TransactionFilters) {
    ensureAuthenticated(userId);

    const repositoryFilters = { ...filters };

    if (filters.month) {
        const [yearString, monthString] = filters.month.split("-");

        const year = Number(yearString);
        const monthNumber = Number(monthString);

        repositoryFilters.startDate = new Date(year, monthNumber - 1, 1);

        repositoryFilters.endDate = new Date(year, monthNumber, 1);
    }

    const result = await findTransactionsByUserIdWithFilters(userId, repositoryFilters);

    const totalPages = Math.ceil(result.total / filters.limit);

    return {
        data: result.transactions,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total: result.total,
            totalPages
        }
    };
}

export async function getTransactionByIdService(id: string, userId: string) {
    assertTransactionId(id);

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
    assertTransactionId(id);

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

    
    const categoryId = data.categoryId ?? existingTransaction.categoryId.toString();
        
    const type = data.type ?? existingTransaction.type;

    const category = await findCategoryByIdAndUserId(categoryId, userId);

    if (!category) {
        throw new AppError(
            "CATEGORY_NOT_FOUND",
            "Category not found.",
            404
        );
    }

    if (type !== category.type) {
        throw new AppError(
            "TRANSACTION_TYPE_MISMATCH",
            "Transaction type doesn't match category type.",
            400
        );
    }

    const transaction = await updateTransaction(data, id, userId);

    if (!transaction) {
        throwTransactionNotFound();
    }

    return transaction;
}

export async function deleteTransactionService(id: string, userId: string) {
    assertTransactionId(id);
    
    ensureAuthenticated(userId);

    const transaction = await deleteTransaction(id, userId);

    if (!transaction) {
        throwTransactionNotFound();
    }

    return transaction;
}

export async function getMonthlyTransactionSummaryService(userId: string, month: string) {
    if (!userId) {
        throw new AppError(
            "SESSION_INVALID",
            "User is not authenticated.",
            401,
        );
    }

    const [yearString, monthString] = month.split("-");

    const year = Number(yearString);
    const monthNumber = Number(monthString);

    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);

    const summary = await getMonthlyTransactionSummary(userId, startDate, endDate);

    let income = 0;
    let expense = 0;

    for (const item of summary) {
        const total = Number(item.total.toString());

        if (item._id === "income") {
            income = total;
        }

        if (item._id === "expense") {
            expense = total;
        }
    }

    return {
        year,
        month: monthNumber,
        income,
        expense,
        balance: income - expense,
    };
}