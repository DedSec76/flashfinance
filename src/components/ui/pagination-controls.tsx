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
    <nav className="card pagination" aria-label="Pagination">
      <p>
        Page {currentPage} of {totalPages}
      </p>
      <div className="item-actions">
        <a
          href={getPageHref(previousPage)}
          aria-disabled={isPreviousDisabled}
          className="btn btn-secondary btn-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Previous
        </a>
        <a
          href={getPageHref(nextPage)}
          aria-disabled={isNextDisabled}
          className="btn btn-secondary btn-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Next
        </a>
      </div>
    </nav>
  );
}
