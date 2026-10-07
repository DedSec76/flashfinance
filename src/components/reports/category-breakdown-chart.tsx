import { formatUsd } from "@/src/lib/money";
import { EmptyState } from "@/src/components/ui/empty-state";
import type { SummaryCategory } from "@/src/services/summary/summary.service";

type CategoryBreakdownProps = {
  title: string;
  categories: SummaryCategory[];
};

export function CategoryBreakdownChart({ title, categories }: CategoryBreakdownProps) {
  const largest = categories.reduce((max, category) => Math.max(max, category.total), 0);

  return (
    <section className="card">
      <h2>{title}</h2>
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create a category before totals can be grouped."
        />
      ) : (
        <ul className="transaction-list" style={{ marginTop: "var(--space-md)" }}>
          {categories.map((category) => {
            const width = largest > 0 ? Math.max((category.total / largest) * 100, category.total > 0 ? 4 : 0) : 0;

            return (
              <li key={category.id} className="transaction-item">
                <div>
                  <p style={{ color: "var(--color-heading)", fontWeight: 600 }}>{category.name}</p>
                  <span className={category.type === "income" ? "badge badge-income" : "badge badge-expense"}>
                    {category.type}
                  </span>
                </div>
                <div style={{ minWidth: "8rem", textAlign: "right" }}>
                  <p className={category.type === "income" ? "transaction-income" : "transaction-expense"}>
                    {formatUsd(category.total)}
                  </p>
                  <div
                    aria-label={`${category.name} total`}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={largest}
                    aria-valuenow={category.total}
                    style={{
                      marginTop: "0.4rem",
                      height: "0.4rem",
                      borderRadius: "999px",
                      background: "var(--color-border)",
                    }}
                  >
                    <div
                      style={{
                        width: `${width}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background:
                          category.type === "income" ? "var(--color-success)" : "var(--color-danger)",
                      }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
