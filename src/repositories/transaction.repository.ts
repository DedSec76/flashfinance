import { connectToDatabase } from "../lib/mongodb/connection";
import { Transaction as TransactionModel } from "../lib/models/transaction.model";
import type { CreateTransactionData, UpdateTransactionData } from "../types/transaction";
import { Types } from "mongoose";

export async function createTransaction(data: CreateTransactionData) {
    await connectToDatabase();

    return await TransactionModel.create(data);
}

export async function findTransactionsByUserId(userId: string) {
    await connectToDatabase();

    return TransactionModel.find({ userId }).sort({ date: -1, createdAt: -1 });
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