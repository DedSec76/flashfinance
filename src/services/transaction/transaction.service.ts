import { AppError } from "@/lib/errors/app-error";
import { findCategoryByIdAndUserId } from "@/repositories/category.repository";
import {
  createTransaction,
  findTransactionsByUserId,
} from "@/repositories/transaction.repository";
import type { CreateTransactionInput } from "@/types/transaction";

export async function createTransactionService(
  userId: string,
  data: CreateTransactionInput,
) {
  if (!userId) {
    throw new AppError("SESSION_INVALID", "User is not authenticated.", 401);
  }

  const category = await findCategoryByIdAndUserId(data.categoryId, userId);

  if (!category) {
    throw new AppError("CATEGORY_NOT_FOUND", "Category not found.", 404);
  }

  if (data.type !== category.type) {
    throw new AppError(
      "TRANSACTION_TYPE_MISMATCH",
      "Transaction type doesn't match category type.",
      400,
    );
  }

  if (data.amount <= 0) {
    throw new AppError("INVALID_AMOUNT", "Amount must be greater than 0", 400);
  }

  if (data.date > new Date()) {
    throw new AppError("INVALID_DATE", "Date cannot be in the future.", 400);
  }

  return createTransaction({ ...data, userId });
}

export async function getTransactionsService(
  userId: string,
  startDate?: Date,
  endDate?: Date,
) {
  if (!userId) {
    throw new AppError("SESSION_INVALID", "User is not authenticated.", 401);
  }

  return findTransactionsByUserId(userId, startDate, endDate);
}
