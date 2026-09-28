export function MonthlySummaryPanel() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-900">Monthly Summary</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <SummaryItem label="Income" value="$0.00" />
        <SummaryItem label="Expenses" value="$0.00" />
        <SummaryItem label="Balance" value="$0.00" />
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
