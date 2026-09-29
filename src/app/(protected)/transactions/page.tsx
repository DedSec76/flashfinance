import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        subtitle="Filter and manage your income and expenses."
      />

      <Suspense
        fallback={
          <section className="rounded-lg border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-600">Loading filters...</p>
          </section>
        }
      >
        <TransactionFilterBar />
      </Suspense>

      <TransactionTable rows={[]} />

      <PaginationControls currentPage={1} totalPages={1} />
    </div>
  );
}