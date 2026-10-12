import Link from "next/link";

type TransactionRowActionsProps = {
  id: string;
  title: string;
};

export function TransactionRowActions({ id, title }: TransactionRowActionsProps) {
  return (
    <div className="item-actions">
      <Link className="btn btn-secondary btn-sm" href={`/transactions/${id}/edit`}>
        Edit<span className="sr-only"> {title}</span>
      </Link>
      <button type="button" className="btn btn-danger-outline btn-sm">
        Delete<span className="sr-only"> {title}</span>
      </button>
    </div>
  );
}
