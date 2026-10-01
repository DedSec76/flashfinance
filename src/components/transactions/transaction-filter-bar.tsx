type TransactionFilterValues = {
  type?: "income" | "expense";
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

type TransactionFilterBarProps = {
  filters: TransactionFilterValues;
  categories: TransactionFilterCategory[];
};

export function TransactionFilterBar({ filters, categories }: TransactionFilterBarProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm font-medium text-zinc-900">Filter transactions</p>
      <form method="get" action="/transactions" className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <select name="type" defaultValue={filters.type ?? ""} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          name="categoryId"
          defaultValue={filters.categoryId ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.type})
            </option>
          ))}
        </select>

        <input
          name="month"
          type="month"
          defaultValue={filters.month ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />

        <select name="limit" defaultValue={filters.limit ?? "10"} className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>

        <input
          name="startDate"
          type="date"
          defaultValue={filters.startDate ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />

        <input
          name="endDate"
          type="date"
          defaultValue={filters.endDate ?? ""}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />

        <input
          name="minAmount"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={filters.minAmount ?? ""}
          placeholder="Minimum amount"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />

        <input
          name="maxAmount"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={filters.maxAmount ?? ""}
          placeholder="Maximum amount"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />

        <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-2">
          <button type="submit" className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
            Apply filters
          </button>
          <a href="/transactions" className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
            Clear
          </a>
        </div>
      </form>
    </section>
  );
}
