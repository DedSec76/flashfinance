import { roundMoney } from "@/src/lib/money";
import { findCategoriesByUserId } from "@/src/repositories/category.repository";
import {
  sumTransactionsByCategory,
  sumTransactionsByType,
} from "@/src/repositories/transaction.repository";

export type SummaryCategory = {
  id: string;
  name: string;
  type: "income" | "expense";
  total: number;
};

export type FinancialSummary = {
  scope: "overall" | "month";
  month: string | null;
  income: number;
  expenses: number;
  balance: number;
  categories: SummaryCategory[];
};

function monthRange(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthIndex = Number(monthText);

  return {
    start: new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0, 0)),
    end: new Date(Date.UTC(year, monthIndex, 0, 23, 59, 59, 999)),
  };
}

export async function getFinancialSummary(
  userId: string,
  options?: { month?: string },
): Promise<FinancialSummary> {
  const range = options?.month ? monthRange(options.month) : undefined;
  const [typeTotals, categoryTotals, categories] = await Promise.all([
    sumTransactionsByType(userId, range),
    sumTransactionsByCategory(userId, range),
    findCategoriesByUserId(userId),
  ]);

  const income = roundMoney(
    typeTotals.find((row) => row._id === "income")?.total ?? 0,
  );
  const expenses = roundMoney(
    typeTotals.find((row) => row._id === "expense")?.total ?? 0,
  );
  const totalByCategory = new Map(
    categoryTotals.map((row) => [String(row._id), roundMoney(row.total)]),
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
