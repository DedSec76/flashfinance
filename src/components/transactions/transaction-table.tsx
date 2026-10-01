import { TransactionRowActions } from "@/src/components/transactions/transaction-row-actions";
import { EmptyState } from "@/src/components/ui/empty-state";

type TransactionRow = {
  id: string;
  date: string;
  type: "income" | "expense";
  amount: number;
  category: string;
};

type TransactionTableProps = {
  rows: TransactionRow[];
};

export function TransactionTable({ rows }: TransactionTableProps) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (rows.length === 0) {
    return <EmptyState title="No transactions yet" description="Create your first income or expense record." />;
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Amount</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-200">
              <td className="px-3 py-2">{row.date}</td>
              <td className="px-3 py-2 capitalize">{row.type}</td>
              <td className="px-3 py-2">{row.category}</td>
              <td className="px-3 py-2">{currencyFormatter.format(row.amount)}</td>
              <td className="px-3 py-2">
                <TransactionRowActions id={row.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
