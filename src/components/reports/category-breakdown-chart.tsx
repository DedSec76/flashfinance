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
    <section className="card stack">
      <h2>{title}</h2>
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create a category before totals can be grouped."
        />
      ) : (
        <ul className="transaction-list">
          {categories.map((category) => {
            const width = largest > 0 ? Math.max((category.total / largest) * 100, category.total > 0 ? 4 : 0) : 0;

            return (
              <li key={category.id} className="transaction-item">
                <div>
                  <p className="item-title">{category.name}</p>
                  <span className={category.type === "income" ? "badge badge-income" : "badge badge-expense"}>
                    {category.type}
                  </span>
                </div>
                <div className="meter-value">
                  <p className={category.type === "income" ? "transaction-income" : "transaction-expense"}>
                    {formatUsd(category.total)}
                  </p>
                  <div
                    className="meter"
                    aria-label={`${category.name} total`}
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={largest}
                    aria-valuenow={category.total}
                  >
                    <div
                      className={category.type === "income" ? "meter-fill meter-fill-income" : "meter-fill meter-fill-expense"}
                      style={{ width: `${width}%` }}
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
