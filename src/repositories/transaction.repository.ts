import { connectToDatabase } from "../lib/mongodb/connection";
import { Transaction as TransactionModel } from "../lib/models/transaction.model";
import type { CreateTransactionData, TransactionFilters, UpdateTransactionData } from "../types/transaction";
import { Types } from "mongoose";

export async function createTransaction(data: CreateTransactionData) {
    await connectToDatabase();

    return await TransactionModel.create(data);
}

export async function findTransactionsByUserId(userId: string) {
    await connectToDatabase();

    return TransactionModel.find({ userId }).sort({ date: -1, createdAt: -1 });
}

export async function findTransactionsByUserIdWithFilters(userId: string, filters: TransactionFilters) {
    await connectToDatabase();

    const query: Record<string, unknown> = {
        userId
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.categoryId) {
        query.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
        query.date = {};

        if (filters.startDate) {
            (query.date as Record<string, Date>).$gte = filters.startDate;
        }

        if (filters.endDate) {
            (query.date as Record<string, Date>).$lt = filters.endDate;
        }
    }

    if (filters.minAmount !== undefined ||
        filters.maxAmount !== undefined
    ) {
        query.amount = {};

        if (filters.minAmount !== undefined) {
            (query.amount as Record<string, number>).$gte = filters.minAmount;
        }

        if (filters.maxAmount !== undefined) {
            (query.amount as Record<string, number>).$lte = filters.maxAmount;
        }
    }

    const skip = (filters.page - 1) * filters.limit;

    const [transactions, total] = await Promise.all([
        TransactionModel.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(filters.limit),

        TransactionModel.countDocuments(query),
    ]);
    
    return {
        transactions,
        total,
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

export async function getMonthlyTransactionSummary(userId: string, startDate: Date, endDate: Date) {
    await connectToDatabase();

    return TransactionModel.aggregate([
        {
            $match: {
                userId: new Types.ObjectId(userId),
                date: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },
        {
            $group: {
                _id: "$type",
                total: {
                    $sum: "$amount",
                },
            },
        },
    ]);
}

export async function countTransactionsForCategory(
  categoryId: string,
  userId: string,
) {
  await connectToDatabase();

  return TransactionModel.countDocuments({
    categoryId,
    userId,
  });
}