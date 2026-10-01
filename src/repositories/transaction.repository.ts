import { connectToDatabase } from "../lib/mongodb/connection";
import { Transaction as TransactionModel } from "../lib/models/transaction.model";
import type {
    CreateTransactionData,
    PaginatedTransactionsResult,
    TransactionFilters,
    UpdateTransactionData,
} from "../types/transaction";

export async function createTransaction(data: CreateTransactionData) {
    await connectToDatabase();

    return await TransactionModel.create(data);
}

function buildDateRange(filters: TransactionFilters) {
    const dateRange: { $gte?: Date; $lte?: Date } = {};

    if (filters.month) {
        const [yearText, monthText] = filters.month.split("-");
        const year = Number(yearText);
        const month = Number(monthText);

        const monthStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const monthEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

        dateRange.$gte = monthStart;
        dateRange.$lte = monthEnd;
    }

    if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setUTCHours(0, 0, 0, 0);

        dateRange.$gte = dateRange.$gte && dateRange.$gte > startDate
            ? dateRange.$gte
            : startDate;
    }

    if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setUTCHours(23, 59, 59, 999);

        dateRange.$lte = dateRange.$lte && dateRange.$lte < endDate
            ? dateRange.$lte
            : endDate;
    }

    return dateRange;
}

export async function findTransactionsByUserId(
    userId: string,
    filters: TransactionFilters
): Promise<PaginatedTransactionsResult> {
    await connectToDatabase();

    const query: {
        userId: string;
        type?: "income" | "expense";
        categoryId?: string;
        date?: { $gte?: Date; $lte?: Date };
        amount?: { $gte?: number; $lte?: number };
    } = { userId };

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.categoryId) {
        query.categoryId = filters.categoryId;
    }

    const dateRange = buildDateRange(filters);

    if (dateRange.$gte || dateRange.$lte) {
        query.date = dateRange;
    }

    if (
        typeof filters.minAmount === "number" ||
        typeof filters.maxAmount === "number"
    ) {
        query.amount = {};

        if (typeof filters.minAmount === "number") {
            query.amount.$gte = filters.minAmount;
        }

        if (typeof filters.maxAmount === "number") {
            query.amount.$lte = filters.maxAmount;
        }
    }

    const skip = (filters.page - 1) * filters.limit;

    const [items, totalItems] = await Promise.all([
        TransactionModel.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(filters.limit)
            .populate("categoryId", "name")
            .lean(),
        TransactionModel.countDocuments(query),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / filters.limit));

    return {
        items,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            totalItems,
            totalPages,
        },
    };
}

export async function findTransactionByIdAndUserId(id: string, userId: string) {
    await connectToDatabase();

    return TransactionModel.findOne({ _id: id, userId });
}

export async function updateTransaction(
    data: UpdateTransactionData,
    id: string,
    userId: string
) {
    await connectToDatabase();

    return TransactionModel.findOneAndUpdate(
        { _id: id, userId },
        { $set: data },
        { new: true, runValidators: true }
    );
}

export async function deleteTransaction(id: string, userId: string) {
    await connectToDatabase();

    return TransactionModel.findOneAndDelete({ _id: id, userId });
}