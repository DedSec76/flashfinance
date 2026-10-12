import { AppError } from "@/lib/errors/app-error";
import { roundMoney, toMoneyNumber } from "@/src/lib/money";
import { findCategoriesByUserId } from "@/src/repositories/category.repository";
import { sumTransactionsByCategory, sumTransactionsByType } from "@/src/repositories/transaction.repository";
import { FinancialSummary } from "@/types/summary";
import { transactionSummarySchema } from "@/validations/transaction.validation";

function monthRange(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);

  return {
    start: new Date(year, monthNumber - 1, 1),
    end: new Date(year, monthNumber, 1),
  };
}

export async function getFinancialSummary(
  userId: string,
  options?: { month?: string },
): Promise<FinancialSummary> {

  if(!userId) {
    throw new AppError(
      "SESSION_INVALID",
      "Authentication required",
      401
    )
  }

  if (options?.month) {
    const validation = transactionSummarySchema.safeParse({
      month: options.month,
    });

    if (!validation.success) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Invalid month. Use YYYY-MM format.",
        400,
      );
    }
  }

  const range = options?.month 
    ? monthRange(options.month) 
    : undefined;
    
  const [typeTotals, categoryTotals, categories] = await Promise.all([
    sumTransactionsByType(userId, range),
    sumTransactionsByCategory(userId, range),
    findCategoriesByUserId(userId),
  ]);

  const income = toMoneyNumber(
    typeTotals.find((row) => row._id === "income")?.total ?? 0,
  );

  const expenses = toMoneyNumber(
    typeTotals.find((row) => row._id === "expense")?.total ?? 0,
  );

  const totalByCategory = new Map(
    categoryTotals.map((row) => [
      String(row._id), 
      toMoneyNumber(row.total)
    ]),
  );

  const summaryCategories = categories
    .map((category) => ({
      id: String(category._id),
      name: category.name,
      type: category.type as "income" | "expense",
      total: totalByCategory.get(String(category._id)) ?? 0,
    }))
    .sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === "income" ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  return {
    scope: options?.month ? "month" : "overall",
    month: options?.month ?? null,
    income,
    expenses,
    balance: roundMoney(income - expenses),
    categories: summaryCategories,
  };
}
