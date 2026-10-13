import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { TransactionTable, type TransactionTableRow } from "@/components/transactions/transaction-table";
import { PaginationControls } from "@/components/ui/pagination-controls";

import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { getTransactionsService } from "@/services/transaction/transaction.service";
import { transactionFiltersSchema } from "@/validations/transaction.validation";

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  if (typeof value === "object" &&
    value !== null &&
    "toString" in value &&
    typeof value.toString === "function"
  ) {
    return Number(value.toString());
  }

  return 0;
}

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function getPageHref(page: number, params: Record<string, string | string[] | undefined>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || value === undefined) continue;

    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (normalizedValue) {
      searchParams.set(key, normalizedValue);
    }
  }

  searchParams.set("page", String(page));

  return `/transactions?${searchParams.toString()}`;
}

function getCurrentHref(params: Record<string, string | string[] | undefined>,) : string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const normalizedValue = Array.isArray(value) ? value[0] : value;

    if (normalizedValue) {
      searchParams.set(key, normalizedValue);
    }
  }

  const query = searchParams.toString();

  return query ? `/transactions?${query}` : "/transactions";
}

export const metadata: Metadata = {
  title: "Transactions",
  description: "Track, create, edit, and manage your financial transactions.",
};
export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const params = await searchParams;

  const rawFilters = {
    type: getParam(params, "type"),
    categoryId: getParam(params, "categoryId"),
    startDate: getParam(params, "startDate"),
    endDate: getParam(params, "endDate"),
    month: getParam(params, "month"),
    minAmount: getParam(params, "minAmount"),
    maxAmount: getParam(params, "maxAmount"),
    page: getParam(params, "page"),
    limit: getParam(params, "limit") ?? "10",
  };

  const parsedFilters = transactionFiltersSchema.safeParse(rawFilters);

  if (!parsedFilters.success) {
    redirect("/transactions");
  }

  let userId: string;

  try {
    userId = await getCurrentUserId();
  } catch (error) {
    if (error instanceof AppError && 
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      redirect("/login");
    }

    throw error;
  }

  const result = await getTransactionsService(userId, parsedFilters.data);

  const rows: TransactionTableRow[] = result.data.map((transaction) => ({
    id: String(transaction.id),
    title: transaction.title,
    date: new Date(transaction.date).toLocaleDateString(),
    type: transaction.type,
    amount: `$${getAmount(transaction.amount).toFixed(2)}`,
    category: transaction.categoryId?.name ?? "Uncategorized",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Filter and manage your income and expenses."
      />

      <div>
        <Link href={"/transactions/new"}
          className="inline-flex rounded-md bg-[#0c2340] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Create Transaction
        </Link>
      </div>

      <Suspense
        fallback={
          <section className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-600">Loading filters...</p>
          </section>
        }
      >
        <TransactionFilterBar />
      </Suspense>

      <TransactionTable rows={rows} returnTo={getCurrentHref(params)} />

      <PaginationControls currentPage={result.pagination.page} totalPages={Math.max(1, result.pagination.totalPages)} getPageHref={(page) => getPageHref(page, params)} />
    
    </div>
  );
}