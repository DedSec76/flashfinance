type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
    </div>
  );
}
