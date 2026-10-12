import Link from "next/link";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
};

export function PaginationControls({ currentPage, totalPages, getPageHref }: PaginationControlsProps) {
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Link
          href={getPageHref(previousPage)}
          aria-disabled={isPreviousDisabled}
          tabIndex={isPreviousDisabled ? -1 : 0}
          className="rounded-md border border-zinc-300 px-2 py-1 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Previous
        </Link>
        <Link
          href={getPageHref(nextPage)}
          aria-disabled={isNextDisabled}
          tabIndex={isNextDisabled ? -1 : 0}
          className="rounded-md border border-zinc-300 px-2 py-1 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Next
        </Link>
      </div>
    </div>
  );
}
