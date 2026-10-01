import { PageHeader } from "@/components/layout/page-header";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { MonthlySummaryPanel } from "@/components/reports/monthly-summary-panel";

export default function MonthlyReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Monthly Report" subtitle="Income, expenses, and balance for the selected month." />
      <MonthlySummaryPanel />
      <CategoryBreakdownChart />
    </div>
  );
}
