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
    <div className="space-y-6">
      <PageHeader
        title="Monthly Report"
        subtitle="Income, expenses, and balance for one calendar month."
      />
      <form method="get" className="card">
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <input
            id="month"
            name="month"
            type="month"
            defaultValue={parsedMonth.success ? parsedMonth.data : currentMonthValue()}
          />
        </div>
        <button className="btn btn-primary" type="submit" style={{ marginTop: "var(--space-md)" }}>
          Show month
        </button>
      </form>
      {parsedMonth.success ? null : (
        <ErrorState title="Invalid month" message="Enter a month like 2026-09." />
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
