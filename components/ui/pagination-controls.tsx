type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
};

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button type="button" className="rounded-md border border-zinc-300 px-2 py-1">
          Previous
        </button>
        <button type="button" className="rounded-md border border-zinc-300 px-2 py-1">
          Next
        </button>
      </div>
    </div>
  );
}
