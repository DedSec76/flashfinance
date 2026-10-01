type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}
