import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import {
  TransactionTable,
  type TransactionTableRow,
} from "@/components/transactions/transaction-table";
import { ErrorState } from "@/components/ui/error-state";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { formatUsd, readMoney } from "@/lib/money";
import { listCategoriesService } from "@/services/category/category.service";
import { getTransactionsService } from "@/services/transaction/transaction.service";

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

type TransactionsPageProps = {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
  }>;
};

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;
  let loadError = "";
  let rows: TransactionTableRow[] | null = null;

  try {
    const userId = await getCurrentUserId();
    const [transactions, categories] = await Promise.all([
      getTransactionsService(userId),
      listCategoriesService(userId),
    ]);
    const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

    rows = transactions.map((transaction) => {
      const categoryId = String(transaction.categoryId);

      return {
        id: String(transaction.id ?? transaction._id),
        title: transaction.title,
        date: new Date(transaction.date).toLocaleDateString("en-US", {
          timeZone: "UTC",
        }),
        type: transaction.type,
        amount: formatUsd(readMoney(transaction.amount)),
        category: categoryNames.get(categoryId) ?? "Category",
      };
    });
  } catch (error) {
    loadError = failureMessage(error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader
          title="Transactions"
          subtitle="Review and manage your income and expenses."
        />
        <Link className="btn btn-primary" href="/transactions/new">
          Create Transaction
        </Link>
      </div>

      {params.saved === "1" ? (
        <p className="alert alert-success" role="status">
          Transaction saved.
        </p>
      ) : null}
      {params.deleted === "1" ? (
        <p className="alert alert-success" role="status">
          Transaction deleted.
        </p>
      ) : null}
      {loadError ? <ErrorState message={loadError} /> : null}
      {rows ? <TransactionTable rows={rows} /> : null}
    </div>
  );
}
