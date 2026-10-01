import { cookies } from "next/headers";

import { PageHeader } from "@/src/components/layout/page-header";
import { TransactionFilterBar } from "@/src/components/transactions/transaction-filter-bar";
import { TransactionTable } from "@/src/components/transactions/transaction-table";
import { PaginationControls } from "@/src/components/ui/pagination-controls";
import { getSessionByToken } from "@/src/services/session/session.service";
import {
  getTransactionFilterCategoriesService,
  getTransactionsService,
} from "@/src/services/transaction/transaction.service";
import { transactionFiltersSchema } from "@/src/validations/transaction.validation";

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleValue(value: string | string[] | undefined): string | undefined {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (rawValue === undefined) {
    return undefined;
  }

  const normalizedValue = rawValue.trim();

  if (normalizedValue.length === 0) {
    return undefined;
  }

  return normalizedValue;
}

function getFilterValues(searchParams: Record<string, string | string[] | undefined>) {
  return {
    type: toSingleValue(searchParams.type),
    categoryId: toSingleValue(searchParams.categoryId),
    startDate: toSingleValue(searchParams.startDate),
    endDate: toSingleValue(searchParams.endDate),
    month: toSingleValue(searchParams.month),
    minAmount: toSingleValue(searchParams.minAmount),
    maxAmount: toSingleValue(searchParams.maxAmount),
    page: toSingleValue(searchParams.page) ?? "1",
    limit: toSingleValue(searchParams.limit) ?? "10",
  };
}

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filterValues = getFilterValues(resolvedSearchParams);

  const parsedFilters = transactionFiltersSchema.safeParse(filterValues);

  const safeFilters = parsedFilters.success
    ? parsedFilters.data
    : transactionFiltersSchema.parse({ page: "1", limit: "10" });

  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  const userId = token ? (await getSessionByToken(token)).toString() : null;

  const result = userId
    ? await getTransactionsService(userId, safeFilters)
    : {
        items: [],
        pagination: {
          page: 1,
          limit: safeFilters.limit,
          totalItems: 0,
          totalPages: 1,
        },
      };

  const categories = userId
    ? await getTransactionFilterCategoriesService(userId)
    : [];

  const rows = result.items.map((transaction) => {
    const rawTransaction = transaction as unknown as {
      id?: string;
      _id?: string;
      date: Date | string;
      type: "income" | "expense";
      amount: number | { toString: () => string };
      categoryId?: string | { name?: string };
    };

    const category =
      typeof rawTransaction.categoryId === "object" && rawTransaction.categoryId
        ? rawTransaction.categoryId
        : null;

    const amountValue =
      typeof rawTransaction.amount === "number"
        ? rawTransaction.amount
        : Number(rawTransaction.amount.toString());

    return {
      id: String(rawTransaction.id ?? rawTransaction._id),
      date: new Date(rawTransaction.date).toISOString().slice(0, 10),
      type: rawTransaction.type,
      amount: amountValue,
      category: category && "name" in category ? String(category.name) : "Uncategorized",
    };
  });

  const categoryOptions = categories.map((category: { _id: string; name: string; type: "income" | "expense" }) => ({
    id: String(category._id),
    name: category.name,
    type: category.type,
  }));

  const getPageHref = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(filterValues).forEach(([key, value]) => {
      if (!value || key === "page") {
        return;
      }

      params.set(key, value);
    });

    params.set("page", String(page));

    return `/transactions?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Filter and manage your income and expenses." />
      <TransactionFilterBar
        filters={{
          type: filterValues.type as "income" | "expense" | undefined,
          categoryId: filterValues.categoryId,
          startDate: filterValues.startDate,
          endDate: filterValues.endDate,
          month: filterValues.month,
          minAmount: filterValues.minAmount,
          maxAmount: filterValues.maxAmount,
          limit: filterValues.limit,
        }}
        categories={categoryOptions}
      />
      <TransactionTable rows={rows} />
      <PaginationControls
        currentPage={result.pagination.page}
        totalPages={result.pagination.totalPages}
        getPageHref={getPageHref}
      />
    </div>
  );
}
