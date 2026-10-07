"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TransactionFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedMonth =
    searchParams.get("month") ??
    new Date().toISOString().slice(0, 7);

  function handleMonthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const month = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (month) {
      params.set("month", month);
    } else {
      params.delete("month");
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  function clearFilter() {
    router.push("/dashboard");
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label
            htmlFor="transaction-month"
            className="block text-sm font-medium text-zinc-900"
          >
            Filter Transactions by Month
          </label>

          <input
            id="transaction-month"
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="mt-2 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>

        <button
          type="button"
          onClick={clearFilter}
          className="w-fit rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Clear Filter
        </button>
      </div>
    </section>
  );
}