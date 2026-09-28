import { PageHeader } from "@/components/layout/page-header";
import { CategoryBreakdownChart } from "@/components/reports/category-breakdown-chart";
import { MonthlySummaryPanel } from "@/components/reports/monthly-summary-panel";
import { StatCard } from "@/components/ui/stat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your current financial status." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Income" value="$0.00" />
        <StatCard title="Expenses" value="$0.00" />
        <StatCard title="Balance" value="$0.00" />
      </div>
      <MonthlySummaryPanel />
      <CategoryBreakdownChart />
    </div>
  );
}
