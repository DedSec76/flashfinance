import Link from "next/link";
import { cookies } from "next/headers";

import { PageHeader } from "@/components/layout/page-header";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { MoneySummary } from "@/components/reports/monthly-summary-panel";
import {
  TransactionTable,
  type TransactionTableRow,
} from "@/components/transactions/transaction-table";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { StatCard } from "@/components/ui/stat-card";
import { getSessionByToken } from "@/services/session/session.service";
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

function getAmount(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    return Number(value.toString());
  }

  return 0;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const selectedMonth = params.month;

  let transactions: DashboardTransaction[] = [];

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value;

    if (token) {
      const userId = await getSessionByToken(token);

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (selectedMonth) {
        const [year, monthNumber] = selectedMonth.split("-").map(Number);

        if (
          Number.isInteger(year) &&
          Number.isInteger(monthNumber) &&
          monthNumber >= 1 &&
          monthNumber <= 12
        ) {
          startDate = new Date(year, monthNumber - 1, 1);
          endDate = new Date(year, monthNumber, 1);
        }
      }

      transactions = await getTransactionsService(
        userId.toString(),
        startDate,
        endDate,
      );
    }
  } catch {
    transactions = [];
  }

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + getAmount(transaction.amount), 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + getAmount(transaction.amount), 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const tableRows: TransactionTableRow[] = transactions.map(
    (transaction) => ({
      id: transaction.id,
      title: transaction.title,
      date: new Date(transaction.date).toLocaleDateString(),
      type: transaction.type,
      amount: formatCurrency(getAmount(transaction.amount)),
      category: transaction.categoryId,
    }),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your current financial status."
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/transactions/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Create Transaction
        </Link>

        <Link
          href="/categories"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Create Category
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Income" value={formatCurrency(totalIncome)} />
        <StatCard title="Expenses" value={formatCurrency(totalExpenses)} />
        <StatCard title="Balance" value={formatCurrency(balance)} />
      </div>

      <TransactionFilterBar />

      <TransactionTable rows={tableRows} />

      <MoneySummary title="expense del dia" description="expense que se paso del limite" income={200} expenses={500} balance={800} />

      <CategoryBreakdownChart title="cateoria breakdown" categories={["groseries","candies"]}/>
    </div>
  );
}