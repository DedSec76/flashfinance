import { PageHeader } from "@/components/layout/page-header";
import { TransactionFilterBar } from "@/components/transactions/transaction-filter-bar";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Filter and manage your income and expenses." />
      <TransactionFilterBar />
      <TransactionTable />
      <PaginationControls currentPage={1} totalPages={1} />
    </div>
  );
}
