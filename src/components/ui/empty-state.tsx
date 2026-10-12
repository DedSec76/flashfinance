type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state-title">{title}</p>
      <p className="text-muted">{description}</p>
    </div>
  );
}
