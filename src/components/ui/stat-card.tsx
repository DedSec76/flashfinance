type StatCardProps = {
  title: string;
  value: string;
  tone?: "income" | "expense" | "neutral";
};

export function StatCard({ title, value, tone = "neutral" }: StatCardProps) {
  const toneStyles = {
    income: {
      icon: "↗",
      label: "Total income",
      color: "text-green-700",
      iconBg: "bg-green-50",
    },
    expense: {
      icon: "↘",
      label: "Total expenses",
      color: "text-red-700",
      iconBg: "bg-red-50",
    },
    neutral: {
      icon: "↔",
      label: "Net balance",
      color: "text-[#0c2340]",
      iconBg: "bg-[#e7f2fb]",
    },
  };

  const style = toneStyles[tone];

  return (
    <section className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#6b7280]">
            {title}
          </p>
          <p className={`text-2xl font-semibold tracking-tight ${style.color}`}>
            {value}
          </p>
        </div>

        <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl ${style.iconBg} ${style.color}`}>
          {style.icon}
        </span>
      </div>

      <p className="mt-4 text-xs text-[#9ca3af]">
        {style.label}
      </p>
    </section>
  );
}
