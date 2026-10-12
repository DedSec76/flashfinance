type StatCardProps = {
  title: string;
  value: string;
  tone?: "income" | "expense" | "neutral";
};

export function StatCard({ title, value, tone = "neutral" }: StatCardProps) {
  const valueClass =
    tone === "income" ? "transaction-income" : tone === "expense" ? "transaction-expense" : "";

  return (
    <section className="dashboard-card" aria-label={`${title} ${value}`}>
      <h2 className="dashboard-card-title">{title}</h2>
      <p className={`dashboard-card-value ${valueClass}`}>{value}</p>
    </section>
  );
}
