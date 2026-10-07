import { CategoryBreakdownChart } from "@/src/components/reports/category-breakdown-chart";
import { MoneySummary } from "@/src/components/reports/monthly-summary-panel";
import { PageHeader } from "@/src/components/layout/page-header";
import { ErrorState } from "@/src/components/ui/error-state";
import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { AppError } from "@/src/lib/errors/app-error";
import { currentMonthValue, formatMonthLabel } from "@/src/lib/money";
import {
  getFinancialSummary,
  type FinancialSummary,
} from "@/src/services/summary/summary.service";

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export default async function DashboardPage() {
  const month = currentMonthValue();
  let overall: FinancialSummary | null = null;
  let monthly: FinancialSummary | null = null;
  let loadError = "";

  try {
    const userId = await getCurrentUserId();
    [overall, monthly] = await Promise.all([
      getFinancialSummary(userId),
      getFinancialSummary(userId, { month }),
    ]);
  } catch (error) {
    loadError = failureMessage(error);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Income, expenses, and balance for your account."
      />
      {loadError ? <ErrorState message={loadError} /> : null}
      {overall && monthly ? (
        <>
          <MoneySummary
            title="Overall"
            description="Every transaction on this account."
            income={overall.income}
            expenses={overall.expenses}
            balance={overall.balance}
          />
          <MoneySummary
            title={formatMonthLabel(month)}
            description="This calendar month."
            income={monthly.income}
            expenses={monthly.expenses}
            balance={monthly.balance}
          />
          <CategoryBreakdownChart title="Categories" categories={overall.categories} />
        </>
      ) : null}
    </div>
  );
}
