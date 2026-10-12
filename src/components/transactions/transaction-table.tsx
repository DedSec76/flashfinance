import { TransactionRowActions } from "@/components/transactions/transaction-row-actions";
import { EmptyState } from "@/components/ui/empty-state";

export type TransactionTableRow = {
  id: string;
  title: string;
  date: string;
  type: "income" | "expense";
  amount: string;
  category: string;
};

type TransactionTableProps = {
  rows: TransactionTableRow[];
};

export function TransactionTable({ rows }: TransactionTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Create your first income or expense record."
      />
    );
  }

  return (
    <section aria-label="Transactions">
      <ul className="transaction-cards">
        {rows.map((row) => (
          <li key={row.id} className="transaction-item">
            <div>
              <p className="item-title">{row.title}</p>
              <p className="text-muted">
                {row.date} · {row.category}
              </p>
              <span className={row.type === "income" ? "badge badge-income" : "badge badge-expense"}>
                {row.type}
              </span>
            </div>
            <div>
              <p className={row.type === "income" ? "transaction-income" : "transaction-expense"}>
                {row.amount}
              </p>
              <TransactionRowActions id={row.id} title={row.title} />
            </div>
          </li>
        ))}
      </ul>

      <div className="data-table-wrap">
        <div className="data-table-scroll">
          <table className="data-table">
            <caption className="sr-only">Transactions</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col">Type</th>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.title}</td>
                  <td>
                    <span className={row.type === "income" ? "badge badge-income" : "badge badge-expense"}>
                      {row.type}
                    </span>
                  </td>
                  <td>{row.category}</td>
                  <td className={row.type === "income" ? "money transaction-income" : "money transaction-expense"}>
                    {row.amount}
                  </td>
                  <td>
                    <TransactionRowActions id={row.id} title={row.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
