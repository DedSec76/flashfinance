"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function TransactionFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedMonth = searchParams.get("month") ?? new Date().toISOString().slice(0, 7);

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
    <section className="card" aria-label="Transaction filters">
      <div className="filter-bar">
        <div className="form-group month-field">
          <label htmlFor="transaction-month">Month</label>
          <input id="transaction-month" type="month" value={selectedMonth} onChange={handleMonthChange} />
        </div>
        <button type="button" className="btn btn-secondary" onClick={clearFilter}>
          Clear filter
        </button>
      </div>
    </section>
  );
}
