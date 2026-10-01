import type { ReactNode } from "react";

type TransactionFilterValues = {
  type?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
  minAmount?: string;
  maxAmount?: string;
  limit?: string;
};

type TransactionFilterCategory = {
  id: string;
  name: string;
  type: "income" | "expense";
};

type TransactionFilterErrors = Record<string, string>;

type TransactionFilterBarProps = {
  filters: TransactionFilterValues;
  categories: TransactionFilterCategory[];
  errors?: TransactionFilterErrors;
};

function fieldClassName(hasError: boolean) {
  return hasError
    ? "rounded-md border border-red-400 px-3 py-2 text-sm"
    : "rounded-md border border-zinc-300 px-3 py-2 text-sm";
}

function FilterField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-xs font-medium text-zinc-700">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TransactionFilterBar({
  filters,
  categories,
  errors = {},
}: TransactionFilterBarProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium text-zinc-900">Filter transactions</p>
      <p className="mt-1 text-sm text-zinc-600">
        Leave a field blank to ignore it. A date range includes the start and
        end days, and a month covers that whole calendar month.
      </p>
      <form
        method="get"
        action="/transactions"
        className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4"
      >
        <FilterField id="type" label="Type" error={errors.type}>
          <select
            id="type"
            name="type"
            defaultValue={filters.type ?? ""}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={errors.type ? "type-error" : undefined}
            className={fieldClassName(Boolean(errors.type))}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </FilterField>

        <FilterField id="categoryId" label="Category" error={errors.categoryId}>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={filters.categoryId ?? ""}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={
              errors.categoryId ? "categoryId-error" : undefined
            }
            className={fieldClassName(Boolean(errors.categoryId))}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.type})
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField id="month" label="Month" error={errors.month}>
          <input
            id="month"
            name="month"
            type="month"
            defaultValue={filters.month ?? ""}
            aria-invalid={Boolean(errors.month)}
            aria-describedby={errors.month ? "month-error" : undefined}
            className={fieldClassName(Boolean(errors.month))}
          />
        </FilterField>

        <FilterField id="limit" label="Per page" error={errors.limit}>
          <select
            id="limit"
            name="limit"
            defaultValue={filters.limit ?? "10"}
            aria-invalid={Boolean(errors.limit)}
            aria-describedby={errors.limit ? "limit-error" : undefined}
            className={fieldClassName(Boolean(errors.limit))}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </FilterField>

        <FilterField id="startDate" label="Start date" error={errors.startDate}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={filters.startDate ?? ""}
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? "startDate-error" : undefined}
            className={fieldClassName(Boolean(errors.startDate))}
          />
        </FilterField>

        <FilterField id="endDate" label="End date" error={errors.endDate}>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={filters.endDate ?? ""}
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby={errors.endDate ? "endDate-error" : undefined}
            className={fieldClassName(Boolean(errors.endDate))}
          />
        </FilterField>

        <FilterField
          id="minAmount"
          label="Minimum amount"
          error={errors.minAmount}
        >
          <input
            id="minAmount"
            name="minAmount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={filters.minAmount ?? ""}
            aria-invalid={Boolean(errors.minAmount)}
            aria-describedby={errors.minAmount ? "minAmount-error" : undefined}
            className={fieldClassName(Boolean(errors.minAmount))}
          />
        </FilterField>

        <FilterField
          id="maxAmount"
          label="Maximum amount"
          error={errors.maxAmount}
        >
          <input
            id="maxAmount"
            name="maxAmount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={filters.maxAmount ?? ""}
            aria-invalid={Boolean(errors.maxAmount)}
            aria-describedby={errors.maxAmount ? "maxAmount-error" : undefined}
            className={fieldClassName(Boolean(errors.maxAmount))}
          />
        </FilterField>

        <div className="flex flex-wrap items-center gap-2 md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Apply filters
          </button>
          <a
            href="/transactions"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Clear
          </a>
        </div>
      </form>
    </section>
  );
}
