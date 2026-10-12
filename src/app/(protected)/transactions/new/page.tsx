import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import {
  TransactionForm,
  type TransactionFormCategory,
} from "@/components/transactions/transaction-form";
import { ErrorState } from "@/components/ui/error-state";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { listCategoriesService } from "@/services/category/category.service";

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default async function NewTransactionPage() {
  let categories: TransactionFormCategory[] | null = null;
  let loadError = "";

  try {
    const userId = await getCurrentUserId();
    const records = await listCategoriesService(userId);
    categories = records.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    }));
  } catch (error) {
    loadError = failureMessage(error);
  }

  return (
    <div className="page-stack">
      <PageHeader title="New Transaction" subtitle="Add a new income or expense entry." />
      {loadError ? <ErrorState message={loadError} /> : null}
      {categories && categories.length === 0 ? (
        <section className="card form-panel">
          <h2>Add a category first</h2>
          <p className="text-muted">Transactions need an income or expense category from your account.</p>
          <div className="form-actions">
            <Link className="btn btn-primary" href="/categories">
              Create a category
            </Link>
          </div>
        </section>
      ) : null}
      {categories && categories.length > 0 ? <TransactionForm mode="create" categories={categories} /> : null}
    </div>
  );
}
