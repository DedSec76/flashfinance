import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/transactions/transaction-form";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Transaction" subtitle={`Update or remove transaction ${id}.`} />
      <TransactionForm mode="edit" transactionId={id} />
    </div>
  );
}
