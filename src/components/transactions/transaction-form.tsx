import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type TransactionFormProps = {
  mode: "create" | "edit";
  transactionId?: string;
};

export function TransactionForm({ mode, transactionId }: TransactionFormProps) {
  return (
    <div className="space-y-4">
      <form className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="grid gap-1">
          <label htmlFor="type" className="text-sm font-medium text-zinc-800">
            Type
          </label>
          <select id="type" className="rounded-md border border-zinc-300 px-3 py-2 text-sm">
            <option>income</option>
            <option>expense</option>
          </select>
        </div>

        <div className="grid gap-1">
          <label htmlFor="amount" className="text-sm font-medium text-zinc-800">
            Amount (USD)
          </label>
          <input id="amount" type="number" min="0" step="0.01" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="date" className="text-sm font-medium text-zinc-800">
            Date
          </label>
          <input id="date" type="date" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="category" className="text-sm font-medium text-zinc-800">
            Category
          </label>
          <input id="category" type="text" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="description" className="text-sm font-medium text-zinc-800">
            Description
          </label>
          <textarea id="description" maxLength={1000} className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <button type="submit" className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
          {mode === "create" ? "Create Transaction" : "Update Transaction"}
        </button>
      </form>

      {mode === "edit" && transactionId ? (
        <ConfirmDialog
          title="Delete transaction"
          description={`This will permanently delete transaction ${transactionId}.`}
          confirmLabel="Delete"
        />
      ) : null}
    </div>
  );
}
