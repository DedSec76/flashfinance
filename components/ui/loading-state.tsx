type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
      {label}
    </div>
  );
}
