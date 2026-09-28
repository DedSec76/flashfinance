import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/transactions/transaction-form";

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Transaction" subtitle="Add a new income or expense entry." />
      <TransactionForm mode="create" />
    </div>
  );
}
