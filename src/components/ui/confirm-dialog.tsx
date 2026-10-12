type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
};

export function ConfirmDialog({ title, description, confirmLabel = "Confirm" }: ConfirmDialogProps) {
  return (
    <section className="card form-panel">
      <h2>{title}</h2>
      <p className="text-muted">{description}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-primary">
          {confirmLabel}
        </button>
      </div>
    </section>
  );
}
