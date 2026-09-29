import { connectToDatabase } from "../lib/mongodb/connection";
import { Transaction as TransactionModel } from "../lib/models/transaction.model";
import type {
  CreateTransactionData,
  updateTransactionData,
} from "../types/transaction";

export async function createTransaction(data: CreateTransactionData) {
  await connectToDatabase();

  return await TransactionModel.create(data);
}

export async function findTransactionById(id: string) {
  await connectToDatabase();

  return await TransactionModel.findById(id);
}

export async function findTransactionsByUserId(
  userId: string,
  startDate?: Date,
  endDate?: Date,
) {
  await connectToDatabase();

  const query: {
    userId: string;
    date?: { $gte?: Date; $lt?: Date };
  } = { userId };

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      query.date.$gte = startDate;
    }

    if (endDate) {
      query.date.$lt = endDate;
    }
  }

  return TransactionModel.find(query).sort({ date: -1 });
}

export async function updateTransaction(
  data: updateTransactionData,
  id: string,
) {
  await connectToDatabase();

  return TransactionModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
}

export async function deleteTransaction(id: string) {
  await connectToDatabase();

  return TransactionModel.findByIdAndDelete(id);
}
