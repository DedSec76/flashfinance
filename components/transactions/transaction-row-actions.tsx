type TransactionRowActionsProps = {
  id: string;
};

export function TransactionRowActions({ id }: TransactionRowActionsProps) {
  return (
    <div className="flex gap-2 text-xs">
      <a className="rounded border border-zinc-300 px-2 py-1 hover:bg-zinc-100" href={`/transactions/${id}/edit`}>
        Edit
      </a>
      <button type="button" className="rounded border border-red-300 px-2 py-1 text-red-700 hover:bg-red-50">
        Delete
      </button>
    </div>
  );
}
