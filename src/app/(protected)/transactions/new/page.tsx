import { PageHeader } from "@/src/components/layout/page-header";
import { TransactionForm } from "@/src/components/transactions/transaction-form";

type NewTransactionPageProps = {
  searchParams: Promise<{returnTo?: string}>
};

export default async function NewTransactionPage({ searchParams, }: NewTransactionPageProps) {
  const query = await searchParams;
  
  const returnTo = query.returnTo === "/dashboard" ? "/dashboard" : "/transactions";
  
  return (
    <div className="space-y-6">
      <PageHeader title="New Transaction" subtitle="Add a new income or expense entry." />
      <TransactionForm mode="create" returnTo={returnTo} />
    </div>
  );
}
