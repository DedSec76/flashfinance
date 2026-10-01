import { cookies } from "next/headers";

import { PageHeader } from "@/src/components/layout/page-header";
import { TransactionFilterBar } from "@/src/components/transactions/transaction-filter-bar";
import { TransactionTable } from "@/src/components/transactions/transaction-table";
import { ErrorState } from "@/src/components/ui/error-state";
import { PaginationControls } from "@/src/components/ui/pagination-controls";
import { getSessionByToken } from "@/src/services/session/session.service";
import {
  getTransactionFilterCategoriesService,
  getTransactionsService,
} from "@/src/services/transaction/transaction.service";
import { transactionFiltersSchema } from "@/src/validations/transaction.validation";
import type { ZodError } from "zod";

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSingleValue(
  value: string | string[] | undefined,
): string | undefined {
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

function getFilterValues(
  searchParams: Record<string, string | string[] | undefined>,
) {
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

function collectFilterErrors(error: ZodError) {
  const messages: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string" && !messages[field]) {
      messages[field] = issue.message;
    }
  }

  return messages;
}

const visibleFilterFields = new Set([
  "type",
  "categoryId",
  "startDate",
  "endDate",
  "month",
  "minAmount",
  "maxAmount",
  "limit",
]);

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filterValues = getFilterValues(resolvedSearchParams);

  const parsedFilters = transactionFiltersSchema.safeParse(filterValues);
  const filterErrors = parsedFilters.success
    ? {}
    : collectFilterErrors(parsedFilters.error);
  const hiddenFilterMessages = Object.entries(filterErrors)
    .filter(([field]) => !visibleFilterFields.has(field))
    .map(([, message]) => message);

  const cookieStore = await cookies();
  const token = cookieStore.get("sessionToken")?.value;
  const userId = token ? (await getSessionByToken(token)).toString() : null;

  const result =
    userId && parsedFilters.success
      ? await getTransactionsService(userId, parsedFilters.data)
      : {
          items: [],
          pagination: {
            page: parsedFilters.success ? parsedFilters.data.page : 1,
            limit: parsedFilters.success ? parsedFilters.data.limit : 10,
            totalItems: 0,
            totalPages: 1,
          },
        };

  const hasActiveFilters = parsedFilters.success
    ? Boolean(
        parsedFilters.data.type ||
        parsedFilters.data.categoryId ||
        parsedFilters.data.startDate ||
        parsedFilters.data.endDate ||
        parsedFilters.data.month ||
        typeof parsedFilters.data.minAmount === "number" ||
        typeof parsedFilters.data.maxAmount === "number",
      )
    : false;

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
      category:
        category && "name" in category
          ? String(category.name)
          : "Uncategorized",
    };
  });

  const categoryOptions = categories.map(
    (category: { _id: string; name: string; type: "income" | "expense" }) => ({
      id: String(category._id),
      name: category.name,
      type: category.type,
    }),
  );

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
      <PageHeader
        title="Transactions"
        subtitle="Filter and manage your income and expenses."
      />
      <TransactionFilterBar
        filters={{
          type: filterValues.type,
          categoryId: filterValues.categoryId,
          startDate: filterValues.startDate,
          endDate: filterValues.endDate,
          month: filterValues.month,
          minAmount: filterValues.minAmount,
          maxAmount: filterValues.maxAmount,
          limit: filterValues.limit,
        }}
        categories={categoryOptions}
        errors={filterErrors}
      />
      {parsedFilters.success ? (
        <>
          <TransactionTable rows={rows} hasActiveFilters={hasActiveFilters} />
          <PaginationControls
            currentPage={result.pagination.page}
            totalPages={result.pagination.totalPages}
            getPageHref={getPageHref}
          />
        </>
      ) : (
        <ErrorState
          title="These filters can't be applied"
          message={
            hiddenFilterMessages.length > 0
              ? `Fix the fields above, then apply the filters again. ${hiddenFilterMessages.join(" ")}`
              : "Fix the fields above, then apply the filters again. Transactions stay hidden until the filters are valid."
          }
        />
      )}
    </div>
  );
}
