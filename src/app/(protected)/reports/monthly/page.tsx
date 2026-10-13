import type { Metadata } from "next";
import { CategoryBreakdownChart } from "@/src/components/reports/category-breakdown-chart";
import { MoneySummary } from "@/src/components/reports/monthly-summary-panel";
import { PageHeader } from "@/src/components/layout/page-header";
import { ErrorState } from "@/src/components/ui/error-state";
import { getCurrentUserId } from "@/src/lib/auth/current-user";
import { AppError } from "@/src/lib/errors/app-error";
import { currentMonthValue, formatMonthLabel } from "@/src/lib/money";
import { getFinancialSummary } from "@/src/services/summary/summary.service";
import { summaryMonthSchema } from "@/src/validations/summary.validation";

type MonthlyReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function failureMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export const metadata: Metadata = {
  title: "Monthly Report",
  description:
    "Review monthly income, expenses, and balance, filter transactions by month, and track your financial activity.",
};
export default async function MonthlyReportsPage({ searchParams }: MonthlyReportsPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawMonth = resolvedSearchParams.month;
  const requestedMonth = (Array.isArray(rawMonth) ? rawMonth[0] : rawMonth)?.trim();
  const month = requestedMonth || currentMonthValue();
  const parsedMonth = summaryMonthSchema.safeParse(month);

  let summary = null;
  let loadError = "";

  if (parsedMonth.success) {
    try {
      const userId = await getCurrentUserId();
      summary = await getFinancialSummary(userId, { month: parsedMonth.data });
    } catch (error) {
      loadError = failureMessage(error);
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Monthly Report"
        subtitle="Income, expenses, and balance for one calendar month."
      />
      <form method="get" className="card form-panel">
        <div className="form-group month-field">
          <label htmlFor="month">Month</label>
          <input
            id="month"
            name="month"
            type="month"
            defaultValue={parsedMonth.success ? parsedMonth.data : currentMonthValue()}
            aria-invalid={parsedMonth.success ? undefined : true}
            aria-describedby={parsedMonth.success ? undefined : "month-error"}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Show month
          </button>
        </div>
      </form>
      {parsedMonth.success ? null : (
        <ErrorState id="month-error" title="Invalid month" message="Enter a month like 2026-09." />
      )}
      {loadError ? <ErrorState message={loadError} /> : null}
      {summary ? (
        <>
          <MoneySummary
            title={formatMonthLabel(summary.month ?? month)}
            description="Totals include every day of this month. A quiet month shows $0.00."
            income={summary.income}
            expenses={summary.expenses}
            balance={summary.balance}
          />
          <CategoryBreakdownChart
            title="Categories this month"
            categories={summary.categories}
          />
        </>
      ) : null}
    </div>
  );
}
