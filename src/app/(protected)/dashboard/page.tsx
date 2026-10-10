import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { MoneySummary } from "@/components/reports/monthly-summary-panel";
import { TransactionTable, type TransactionTableRow } from "@/components/transactions/transaction-table";
import { getTransactionsService } from "@/services/transaction/transaction.service";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { getFinancialSummary } from "@/services/summary/summary.service";

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

  let userId: string;

  try {
    userId = await getCurrentUserId();
  } catch(error) {
    if (error instanceof AppError &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      redirect("/login");
    }

    console.error("Dashboard transactions error:", error)
    throw error;
  }

  const [result, summary ]= await Promise.all([
    getTransactionsService(userId, {
        ...(selectedMonth ? { month: selectedMonth }: {}),
        page: 1,
        limit: 5,
    }),

    getFinancialSummary(userId, selectedMonth ? { month: selectedMonth } : undefined),
  ]);

  transactions = result.data;

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const tableRows: TransactionTableRow[] = transactions.map(
    (transaction) => ({
      id: String(transaction.id),
      title: transaction.title,
      date: new Date(transaction.date).toLocaleDateString(),
      type: transaction.type,
      amount: formatCurrency(getAmount(transaction.amount)),
      category: String(transaction.categoryId),
    }),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your current financial status."
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/transactions/new"
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

      <MoneySummary title="Financial Summary" description="General transaction summary" income={summary.income} expenses={summary.expenses} balance={summary.balance} />

      <div>
        <h2 className="mb-2">Latest movements</h2>
        <TransactionTable rows={tableRows} returnTo="/dashboard" />
      </div>

      <div className="flex justify-end">
        <Link
          href="/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all transactions →
        </Link>
      </div>

      <CategoryBreakdownChart title="Breakdown by Category" categories={summary.categories}  />
    </div>
  );
}