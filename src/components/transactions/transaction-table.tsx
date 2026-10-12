import { TransactionRowActions } from "@/src/components/transactions/transaction-row-actions";
import { EmptyState } from "@/src/components/ui/empty-state";

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
  returnTo?: string;
};

export function TransactionTable({ rows, returnTo= "/transactions" }: TransactionTableProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Create your first income or expense record."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-[#6b7280]">
            <tr>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 text-right font-medium">Amount</th>
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#f3f4f6]">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-[#f9fafb]">
                <td className="whitespace-nowrap px-5 py-4 text-[#6b7280]">{row.date}</td>
                <td className="px-5 py-4 font-medium text-[#0c2340]">{row.title}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.type === "income"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {row.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className="px-5 py-4 text-[#4b5563]">{row.category}</td>
                <td
                  className={`whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums ${
                    row.type === "income"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {row.type === "income" ? "+" : "−"}
                  {row.amount}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <TransactionRowActions id={row.id} returnTo={returnTo}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}