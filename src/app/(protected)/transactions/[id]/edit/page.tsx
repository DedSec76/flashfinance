import type { Metadata } from "next";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { getTransactionByIdService } from "@/services/transaction/transaction.service";
import { PageHeader } from "@/src/components/layout/page-header";
import { TransactionForm } from "@/src/components/transactions/transaction-form";

type EditTransactionPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSafeReturnTo(
  value: string | string[] | undefined,
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (candidate === "/dashboard") {
    return candidate;
  }

  if (
    candidate === "/transactions" ||
    candidate?.startsWith("/transactions?")
  ) {
    return candidate;
  }

  return "/transactions";
}

export async function generateMetadata({
  params,
}: EditTransactionPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const userId = await getCurrentUserId();
    const transaction = await getTransactionByIdService(id, userId);

    const title = transaction.title?.trim() || "Transaction";
    
    return {
      title: `Edit ${title}`,
      description: `Update the details of your ${title} transaction in FlashFinance.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: "Edit Transaction",
      description: "Update a transaction in FlashFinance.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}
export default async function EditTransactionPage({
  params,
  searchParams
}: EditTransactionPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);

  const returnTo = getSafeReturnTo(query.returnTo)

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Transaction" subtitle={`Update or remove transaction ${id}.`} />
      <TransactionForm mode="edit" transactionId={id} returnTo={returnTo} />
    </div>
  );
}
