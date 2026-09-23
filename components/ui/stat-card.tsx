type StatCardProps = {
  title: string;
  value: string;
};

export function StatCard({ title, value }: StatCardProps) {
  const isPositive = title.toLowerCase() === "income" || title.toLowerCase() === "balance";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
        <span className="h-2.5 w-2.5 rounded-full bg-sky-400" aria-hidden="true" />
      </div>
      <p className={`mt-4 text-3xl font-bold ${isPositive ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
      </p>
    </section>
  );
}
