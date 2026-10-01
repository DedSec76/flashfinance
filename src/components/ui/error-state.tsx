type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({ title = "Something went wrong", message }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-900">{title}</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}
