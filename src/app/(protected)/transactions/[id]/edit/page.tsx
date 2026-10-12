import { PageHeader } from "@/components/layout/page-header";
import {
  TransactionForm,
  type TransactionFormCategory,
  type TransactionFormValues,
} from "@/components/transactions/transaction-form";
import { ErrorState } from "@/components/ui/error-state";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { AppError } from "@/lib/errors/app-error";
import { readMoney } from "@/lib/money";
import { listCategoriesService } from "@/services/category/category.service";
import { getTransactionByIdService } from "@/services/transaction/transaction.service";

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

function toDateInput(value: Date | string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let loadError = "";
  let categories: TransactionFormCategory[] = [];
  let initialValues: TransactionFormValues | null = null;

  try {
    const userId = await getCurrentUserId();
    const [transaction, records] = await Promise.all([
      getTransactionByIdService(id, userId),
      listCategoriesService(userId),
    ]);

    categories = records.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    }));

    if (transaction) {
      initialValues = {
        title: transaction.title,
        amount: readMoney(transaction.amount).toFixed(2),
        type: transaction.type,
        categoryId: String(transaction.categoryId),
        description: transaction.description ?? "",
        date: toDateInput(transaction.date),
      };
    }
  } catch (error) {
    loadError = failureMessage(error);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Transaction" subtitle="Update or remove this transaction." />
      {loadError ? <ErrorState message={loadError} /> : null}
      {initialValues ? (
        <TransactionForm
          mode="edit"
          transactionId={id}
          categories={categories}
          initialValues={initialValues}
        />
      ) : null}
    </div>
  );
}
