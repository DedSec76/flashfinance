"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryFilter } from "@/types/category";

export function TransactionFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [categoriesError, setCategoriesError] = useState(false);

  const selectedType = searchParams.get("type") ?? "";
  const selectedCategory = searchParams.get("categoryId") ?? "";
  const selectedMonth = searchParams.get("month") ?? "";
  const selectedStartDate = searchParams.get("startDate") ?? "";
  const selectedEndDate = searchParams.get("endDate") ?? "";
  const selectedMinAmount = searchParams.get("minAmount") ?? "";
  const selectedMaxAmount = searchParams.get("maxAmount") ?? "";

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Could not load categories.");
        }

        const data: CategoryFilter[] = await response.json();

        if (!cancelled) {
          setCategories(data)
          setCategoriesError(false);
        }
      } catch {
        if (!cancelled) {
          setCategoriesError(true);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    }
  }, []);

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Reset pagination when the criteria change.
    params.delete("page");

    const query = params.toString();
    router.push(query ? `/transactions?${query}` : "/transactions");
  }

  function clearFilter() {
    router.push("/transactions");
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900">
          Filter Transactions
        </h2>

        <button
          type="button"
          onClick={clearFilter}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Clear filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="transaction-type" className="block text-sm font-medium text-zinc-700">
            Transaction type
          </label>
          <select
            id="transaction-type"
            value={selectedType}
            onChange={(event) => updateFilter("type", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label htmlFor="transaction-category" className="block text-sm font-medium text-zinc-700">
            Category
          </label>
          <select
            id="transaction-category"
            value={selectedCategory}
            onChange={(event) => updateFilter("categoryId", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories
              .filter((category) => !selectedType || category.type === selectedType)
              .map((category) => {
                const id = category.id ?? category._id;

                if (!id) return null;

                return (
                  <option key={id} value={id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
          {categoriesError && (
            <p className="mt-1 text-sm text-red-600">
              Could not load categories.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="transaction-month" className="block text-sm font-medium text-zinc-700">
            Month
          </label>
          <input
            id="transaction-month"
            type="month"
            value={selectedMonth}
            onChange={(event) => updateFilter("month", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="transaction-start-date" className="block text-sm font-medium text-zinc-700">
            Start date
          </label>
          <input
            id="transaction-start-date"
            type="date"
            value={selectedStartDate}
            max={selectedEndDate || undefined}
            onChange={(event) => updateFilter("startDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="transaction-end-date" className="block text-sm font-medium text-zinc-700">
            End date
          </label>
          <input
            id="transaction-end-date"
            type="date"
            value={selectedEndDate}
            min={selectedStartDate || undefined}
            onChange={(event) => updateFilter("endDate", event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="transaction-min-amount" className="block text-sm font-medium text-zinc-700">
            Minimum amount
          </label>
          <input
            id="transaction-min-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={selectedMinAmount}
            onChange={(event) => updateFilter("minAmount", event.target.value)}
            placeholder="e.g. 50.00"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="transaction-max-amount" className="block text-sm font-medium text-zinc-700">
            Maximum amount
          </label>
          <input
            id="transaction-max-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={selectedMaxAmount}
            onChange={(event) => updateFilter("maxAmount", event.target.value)}
            placeholder="e.g. 500.00"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </section>
  );
}