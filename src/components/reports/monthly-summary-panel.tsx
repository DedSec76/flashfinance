import { formatUsd } from "@/src/lib/money";
import { StatCard } from "@/src/components/ui/stat-card";

type MoneySummaryProps = {
  title: string;
  description?: string;
  income: number;
  expenses: number;
  balance: number;
};

export function MoneySummary({
  title,
  description,
  income,
  expenses,
  balance,
}: MoneySummaryProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2>{title}</h2>
        {description ? <p className="text-muted">{description}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Income" value={formatUsd(income)} tone="income" />
        <StatCard title="Expenses" value={formatUsd(expenses)} tone="expense" />
        <StatCard title="Balance" value={formatUsd(balance)} tone="neutral" />
      </div>
    </section>
  );
}
