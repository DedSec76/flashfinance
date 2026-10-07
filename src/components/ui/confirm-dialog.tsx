type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
}: ConfirmDialogProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      <button
        type="button"
        className="mt-3 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
      >
        {confirmLabel}
      </button>
    </section>
  );
}
