import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import {
  TransactionTable,
  type TransactionTableRow,
} from "@/components/transactions/transaction-table";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { ErrorState } from "@/components/ui/error-state";
import { StatCard } from "@/components/ui/stat-card";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { formatUsd, readMoney, roundMoney } from "@/lib/money";
import { listCategoriesService } from "@/services/category/category.service";
import type { SummaryCategory } from "@/services/summary/summary.service";
import { getTransactionsService } from "@/services/transaction/transaction.service";

type DashboardPageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

type DashboardTransaction = {
  id: string;
  title: string;
  date: Date;
  type: "income" | "expense";
  amount: unknown;
  categoryId: string;
};

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const selectedMonth = params.month;

  let transactions: DashboardTransaction[] = [];
  let categories: SummaryCategory[] = [];
  let loadError = "";

  try {
    const userId = await getCurrentUserId();
    const [records, categoryRecords] = await Promise.all([
      getTransactionsService(userId),
      listCategoriesService(userId),
    ]);
    const [year, monthNumber] = (selectedMonth ?? "").split("-").map(Number);
    const hasMonth =
      Number.isInteger(year) &&
      Number.isInteger(monthNumber) &&
      monthNumber >= 1 &&
      monthNumber <= 12;
    const startDate = hasMonth ? new Date(year, monthNumber - 1, 1) : undefined;
    const endDate = hasMonth ? new Date(year, monthNumber, 1) : undefined;

    transactions = records.filter((transaction) => {
      if (!startDate || !endDate) {
        return true;
      }

      const date = new Date(transaction.date);
      return date >= startDate && date < endDate;
    });
    const totals = new Map<string, number>();

    for (const transaction of transactions) {
      const categoryId = String(transaction.categoryId);
      totals.set(
        categoryId,
        roundMoney((totals.get(categoryId) ?? 0) + readMoney(transaction.amount)),
      );
    }

    categories = categoryRecords.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
      total: totals.get(category.id) ?? 0,
    }));
  } catch (error) {
    loadError = failureMessage(error);
  }

  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  const totalIncome = roundMoney(
    transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + readMoney(transaction.amount), 0),
  );

  const totalExpenses = roundMoney(
    transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + readMoney(transaction.amount), 0),
  );

  const balance = roundMoney(totalIncome - totalExpenses);

  const tableRows: TransactionTableRow[] = transactions.map((transaction) => {
    const categoryId = String(transaction.categoryId);

    return {
      id: String(transaction.id),
      title: transaction.title,
      date: new Date(transaction.date).toLocaleDateString("en-US"),
      type: transaction.type,
      amount: formatUsd(readMoney(transaction.amount)),
      category: categoryNames.get(categoryId) ?? "Category",
    };
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your current financial status."
        actions={
          <>
            <Link className="btn btn-primary" href="/transactions/new">
              Create Transaction
            </Link>
            <Link className="btn btn-secondary" href="/categories">
              Create Category
            </Link>
          </>
        }
      />

      {loadError ? <ErrorState message={loadError} /> : null}

      {loadError ? null : (
        <>
          <section aria-label="Balance summary">
            <div className="dashboard-grid">
              <StatCard title="Income" value={formatUsd(totalIncome)} tone="income" />
              <StatCard title="Expenses" value={formatUsd(totalExpenses)} tone="expense" />
              <StatCard
                title="Balance"
                value={formatUsd(balance)}
                tone={balance < 0 ? "expense" : balance > 0 ? "income" : "neutral"}
              />
            </div>
          </section>

          <TransactionFilterBar />

          <section className="stack" aria-labelledby="dashboard-transactions">
            <h2 id="dashboard-transactions">Transactions</h2>
            <TransactionTable rows={tableRows} />
          </section>

          <CategoryBreakdownChart title="Categories" categories={categories} />
        </>
      )}
    </div>
  );
}