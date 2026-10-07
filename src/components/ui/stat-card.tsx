type StatCardProps = {
  title: string;
  value: string;
  tone?: "income" | "expense" | "neutral";
};

export function StatCard({ title, value, tone = "neutral" }: StatCardProps) {
  const valueClass =
    tone === "income" ? "transaction-income" : tone === "expense" ? "transaction-expense" : "";

  return (
    <section className="dashboard-card">
      <p className="dashboard-card-title">{title}</p>
      <p className={`dashboard-card-value ${valueClass}`}>{value}</p>
    </section>
  );
}
